from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncHour, TruncDate
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
import csv
import datetime
from .models import ParkingLot, ParkingSlot, Booking, Payment, AuditLog
from .serializers import (
    UserSerializer, ParkingLotSerializer, ParkingSlotSerializer, 
    BookingSerializer, AuditLogSerializer
)

User = get_user_model()

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

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
        now = timezone.now()

        Booking.objects.filter(
            status='active',
            end_time__lte=now
        ).update(status='completed')

        # return the filtered list to the frontend based on user role
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

class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['get'], url_path='users')
    def users(self, request):
        users = User.objects.all()
        data = []
        for u in users:
            # Count how many bookings this user has made
            bookings_count = Booking.objects.filter(user=u).count()
            data.append({
                'id': u.id,
                'name': u.username, 
                'email': u.email,
                'phone': u.phone_number or 'N/A',
                'role': u.role,
                'joined': u.date_joined.strftime('%Y-%m-%d') if u.date_joined else 'N/A',
                'bookings': bookings_count,
                'status': u.status
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_users = User.objects.count()
        total_lots = ParkingLot.objects.count()
        total_bookings = Booking.objects.count()
        platform_revenue = Payment.objects.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0
        
        total_slots = ParkingSlot.objects.count()
        occupied_slots = ParkingSlot.objects.filter(status='occupied').count()
        occupancy_rate = round((occupied_slots / total_slots * 100), 1) if total_slots > 0 else 0

        return Response({
            'totalUsers': total_users,
            'totalLots': total_lots,
            'totalBookings': total_bookings,
            'platformRevenue': platform_revenue,
            'occupancyRate': occupancy_rate
        })

    @action(detail=False, methods=['get'], url_path='audit-logs')
    def audit_logs(self, request):
        logs = AuditLog.objects.all().order_by('-created_at')
        paginator = PageNumberPagination()
        paginator.page_size = int(request.query_params.get('limit', 10))
        result_page = paginator.paginate_queryset(logs, request)
        serializer = AuditLogSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='analytics/revenue-over-time')
    def revenue_over_time(self, request):
        end_date = timezone.now()
        start_date = end_date - datetime.timedelta(days=30)
        
        payments = Payment.objects.filter(status='completed', created_at__gte=start_date).values('created_at', 'amount')
        
        data = {}
        for payment in payments:
            date_str = payment['created_at'].strftime('%Y-%m-%d')
            data[date_str] = data.get(date_str, 0) + float(payment['amount'])
            
        return Response([{'date': k, 'revenue': v} for k, v in sorted(data.items())])

    @action(detail=False, methods=['get'], url_path='analytics/booking-trends')
    def booking_trends(self, request):
        end_date = timezone.now()
        start_date = end_date - datetime.timedelta(days=30)
        
        bookings = Booking.objects.filter(created_at__gte=start_date).values('created_at')
        
        data = {}
        for booking in bookings:
            date_str = booking['created_at'].strftime('%Y-%m-%d')
            data[date_str] = data.get(date_str, 0) + 1
        
        return Response([{'date': k, 'bookings': v} for k, v in sorted(data.items())])

    @action(detail=False, methods=['get'], url_path='analytics/user-growth')
    def user_growth(self, request):
        end_date = timezone.now()
        start_date = end_date - datetime.timedelta(days=30)
        
        users = User.objects.filter(date_joined__gte=start_date).values('date_joined')
        
        data = {}
        for user in users:
            date_str = user['date_joined'].strftime('%Y-%m-%d')
            data[date_str] = data.get(date_str, 0) + 1
        
        return Response([{'date': k, 'users': v} for k, v in sorted(data.items())])

    @action(detail=False, methods=['get'], url_path='analytics/top-lots')
    def top_lots(self, request):
        data = ParkingLot.objects.annotate(
            revenue=Sum('slots__bookings__payments__amount', filter=Q(slots__bookings__payments__status='completed'))
        ).order_by('-revenue')[:5]
        
        return Response([{'name': lot.name, 'revenue': lot.revenue or 0} for lot in data])

    @action(detail=False, methods=['get'], url_path='analytics/revenue-by-payment-method')
    def revenue_by_payment_method(self, request):
        data = Payment.objects.filter(status='completed')\
            .values('payment_method')\
            .annotate(value=Sum('amount'))\
            .order_by('-value')
        
        return Response([{'name': item['payment_method'].capitalize(), 'value': item['value']} for item in data])

    @action(detail=False, methods=['get'], url_path='analytics/peak-hours')
    def peak_hours(self, request):
        bookings = Booking.objects.values('start_time')
        
        hour_counts = {}
        for b in bookings:
            h = b['start_time'].hour
            hour_counts[h] = hour_counts.get(h, 0) + 1

        return Response([{'hour': f"{h:02d}:00", 'bookings': c} for h, c in sorted(hour_counts.items())])

    @action(detail=False, methods=['get'], url_path='analytics/user-activity')
    def user_activity(self, request):
        data = User.objects.values('status')\
            .annotate(value=Count('id'))\
            .order_by('status')
        
        return Response([{'name': item['status'].capitalize(), 'value': item['value']} for item in data])

    @action(detail=False, methods=['get'], url_path='analytics/occupancy-overview')
    def occupancy_overview(self, request):
        total_slots = ParkingSlot.objects.count()
        occupied_slots = ParkingSlot.objects.filter(status__in=['occupied', 'reserved']).count()
        available_slots = total_slots - occupied_slots

        data = [
            {'name': 'Occupied', 'value': occupied_slots},
            {'name': 'Available', 'value': available_slots}
        ]
        return Response(data)

    @action(detail=False, methods=['get'], url_path='export-analytics')
    def export_analytics(self, request):
        fmt = request.query_params.get('format')
        
        if fmt == 'pdf':
            try:
                from reportlab.pdfgen import canvas
                from reportlab.lib.pagesizes import letter
                from reportlab.lib.units import inch
                import io
                
                buffer = io.BytesIO()
                p = canvas.Canvas(buffer, pagesize=letter)
                width, height = letter

                # Title
                p.setFont("Helvetica-Bold", 16)
                p.drawString(inch, height - inch, "ParkHub Analytics Report")
                p.setFont("Helvetica", 10)
                p.drawString(inch, height - inch - 0.2*inch, f"Generated: {timezone.now().strftime('%Y-%m-%d %H:%M')}")

                # Summary Stats
                p.setFont("Helvetica-Bold", 12)
                p.drawString(inch, height - 2*inch, "Platform Summary")
                p.line(inch, height - 2*inch - 0.1*inch, width - inch, height - 2*inch - 0.1*inch)
                
                total_users = User.objects.count()
                total_lots = ParkingLot.objects.count()
                total_bookings = Booking.objects.count()
                platform_revenue = Payment.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0

                p.setFont("Helvetica", 11)
                text_y = height - 2.5*inch
                p.drawString(inch, text_y, f"Total Users: {total_users}")
                p.drawString(inch, text_y - 0.3*inch, f"Total Parking Lots: {total_lots}")
                p.drawString(inch, text_y - 0.6*inch, f"Total Bookings: {total_bookings}")
                p.drawString(inch, text_y - 0.9*inch, f"Total Revenue: KES {platform_revenue:,.2f}")
                
                p.showPage()
                p.save()
                buffer.seek(0)
                
                response = HttpResponse(buffer, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="parkhub_report_{timezone.now().date()}.pdf"'
                return response
            except ImportError:
                return Response({'error': 'PDF library not installed. Please run "pip install reportlab"'}, status=status.HTTP_501_NOT_IMPLEMENTED)
            except Exception as e:
                return Response({'error': f'Failed to generate PDF: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        elif fmt in ['csv', 'xlsx']:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="parkhub_analytics_{timezone.now().date()}.csv"'
            writer = csv.writer(response)
            
            writer.writerow(['Date', 'Revenue (KES)', 'Bookings', 'New Users'])

            end_date = timezone.now()
            start_date = end_date - datetime.timedelta(days=30)

            # Fetch raw data
            payments = Payment.objects.filter(status='completed', created_at__range=(start_date, end_date)).values('created_at', 'amount')
            bookings = Booking.objects.filter(created_at__range=(start_date, end_date)).values('created_at')
            users = User.objects.filter(date_joined__range=(start_date, end_date)).values('date_joined')

            # Aggregate in Python
            revenue_per_day = {}
            for p in payments:
                d = p['created_at'].strftime('%Y-%m-%d')
                revenue_per_day[d] = revenue_per_day.get(d, 0) + float(p['amount'])

            bookings_per_day = {}
            for b in bookings:
                d = b['created_at'].strftime('%Y-%m-%d')
                bookings_per_day[d] = bookings_per_day.get(d, 0) + 1

            users_per_day = {}
            for u in users:
                d = u['date_joined'].strftime('%Y-%m-%d')
                users_per_day[d] = users_per_day.get(d, 0) + 1
            
            for i in range(30):
                day = (end_date - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
                writer.writerow([
                    day,
                    revenue_per_day.get(day, 0),
                    bookings_per_day.get(day, 0),
                    users_per_day.get(day, 0)
                ])
            
            return response
        
        return Response({'error': 'Invalid format specified. Use "pdf" or "xlsx".'}, status=status.HTTP_400_BAD_REQUEST)
