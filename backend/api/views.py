from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count
from django.db.models.functions import TruncHour
from django.utils import timezone
import datetime
from .models import ParkingLot, ParkingSlot, Booking, Payment
from .serializers import (
    UserSerializer, ParkingLotSerializer, ParkingSlotSerializer, 
    BookingSerializer
)

User = get_user_model()

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        
        if user and user.check_password(password):
            if user.status != 'active':
                 return Response({'error': 'Account is not active'}, status=status.HTTP_403_FORBIDDEN)
                 
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParkingLotViewSet(viewsets.ModelViewSet):
    queryset = ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    def get_queryset(self):
        queryset = ParkingLot.objects.all()
        manager_id = self.request.query_params.get('manager', None)
        if manager_id is not None:
            queryset = queryset.filter(manager_id=manager_id)
        return queryset

class ParkingSlotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = ParkingSlot.objects.all()
        parking_lot_id = self.request.query_params.get('parking_lot', None)
        if parking_lot_id is not None:
            queryset = queryset.filter(parking_lot_id=parking_lot_id)
        return queryset

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'driver':
            return Booking.objects.filter(user=user)
        elif user.role == 'manager':
            return Booking.objects.filter(parking_slot__parking_lot__manager=user)
        return Booking.objects.all()

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def manager(self, request):
        user = request.user
        if user.role != 'manager':
             return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        # Get manager's lots
        lots = ParkingLot.objects.filter(manager=user)
        
        # 1. Total Slots
        total_slots = lots.aggregate(total=Sum('total_capacity'))['total'] or 0
        
        # 2. Current Occupancy
        slots = ParkingSlot.objects.filter(parking_lot__in=lots)
        occupied_slots = slots.filter(status__in=['occupied', 'reserved']).count()
        occupancy_rate = (occupied_slots / total_slots * 100) if total_slots > 0 else 0
        
        # 3. Today's Revenue
        today = timezone.now().date()
        todays_revenue = Payment.objects.filter(
            booking__parking_slot__parking_lot__in=lots,
            created_at__date=today,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # 4. Active Users
        active_users = Booking.objects.filter(
            parking_slot__parking_lot__in=lots,
            status='active'
        ).values('user').distinct().count()

        # 5. Revenue Chart (Hourly for today)
        revenue_data = []
        payments_today = Payment.objects.filter(
            booking__parking_slot__parking_lot__in=lots,
            created_at__date=today,
            status='completed'
        ).annotate(hour=TruncHour('created_at')).values('hour').annotate(revenue=Sum('amount')).order_by('hour')
        
        revenue_map = {p['hour'].hour: p['revenue'] for p in payments_today}
        for h in range(24):
            revenue_data.append({
                'time': f"{h:02d}:00",
                'revenue': revenue_map.get(h, 0)
            })

        # 6. Slot Distribution
        slot_stats = slots.values('status').annotate(count=Count('id'))
        slot_distribution = []
        colors = {
            'available': 'hsl(142, 70%, 50%)',
            'occupied': 'hsl(0, 70%, 50%)',
            'reserved': 'hsl(38, 95%, 50%)',
            'maintenance': 'hsl(215, 15%, 50%)'
        }
        for stat in slot_stats:
            status_name = stat['status']
            slot_distribution.append({
                'name': status_name.capitalize(),
                'value': stat['count'],
                'color': colors.get(status_name, '#cccccc')
            })

        # 7. Recent Bookings
        recent_bookings = Booking.objects.filter(
            parking_slot__parking_lot__in=lots
        ).order_by('-created_at')[:10]
        
        recent_bookings_data = []
        for b in recent_bookings:
            recent_bookings_data.append({
                'id': b.id,
                'slot': b.parking_slot.slot_number,
                'vehicle': b.vehicle_number,
                'duration': f"{b.duration_hours}h",
                'amount': b.total_amount,
                'status': 'paid' if b.payments.filter(status='completed').exists() else 'pending',
                'time': b.created_at.strftime('%I:%M %p')
            })

        # 8. Weekly Occupancy (Mocked trend based on booking count)
        occupancy_data = []
        last_7_days = [today - datetime.timedelta(days=i) for i in range(6, -1, -1)]
        for day in last_7_days:
            count = Booking.objects.filter(
                parking_slot__parking_lot__in=lots,
                created_at__date=day
            ).count()
            # Simple heuristic: assume 1 booking = 5% occupancy for visualization
            rate = min((count * 5), 100) 
            occupancy_data.append({
                'day': day.strftime('%a'),
                'rate': rate
            })

        return Response({
            'stats': {
                'totalSlots': total_slots,
                'occupancyRate': round(occupancy_rate, 1),
                'todaysRevenue': todays_revenue,
                'activeUsers': active_users
            },
            'revenueData': revenue_data,
            'occupancyData': occupancy_data,
            'slotDistribution': slot_distribution,
            'recentBookings': recent_bookings_data
        })
