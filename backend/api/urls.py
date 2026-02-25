from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, ParkingLotViewSet, ParkingSlotViewSet, BookingViewSet, DashboardViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'parking-lots', ParkingLotViewSet)
router.register(r'parking-slots', ParkingSlotViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
