# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = (
        ('driver', 'Driver'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('banned', 'Banned'),
        ('suspended', 'Suspended'),
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='driver')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    
    # Timestamps are handled by Django's date_joined (created_at equivalent)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

class ParkingLot(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_lots')
    total_capacity = models.IntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    
    is_24_7 = models.BooleanField(default=True)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    
    amenities = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'parking_lots'

class ParkingSlot(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('maintenance', 'Maintenance'),
    )

    parking_lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name='slots')
    slot_number = models.CharField(max_length=20)
    section = models.CharField(max_length=10, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    is_ev_charging = models.BooleanField(default=False)
    is_disabled_friendly = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'parking_slots'
        unique_together = ('parking_lot', 'slot_number')

class Booking(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    parking_slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='bookings')
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_hours = models.IntegerField()
    
    vehicle_number = models.CharField(max_length=20)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    booking_reference = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'

class Payment(models.Model):
    METHOD_CHOICES = (
        ('mpesa', 'M-Pesa'),
        ('card', 'Card'),
        ('cash', 'Cash'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    mpesa_receipt = models.CharField(max_length=100, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parking_lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    
    manager_response = models.TextField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        unique_together = ('user', 'parking_lot')

class SystemSetting(models.Model):
    setting_key = models.CharField(max_length=100, primary_key=True)
    setting_value = models.TextField()
    description = models.TextField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_settings'

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50, null=True, blank=True)
    entity_id = models.IntegerField(null=True, blank=True)
    details = models.JSONField(null=True, blank=True)
    ip_address = models.CharField(max_length=45, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'


