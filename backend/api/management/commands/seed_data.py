# backend/api/management/commands/seed_data.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import ParkingLot, ParkingSlot, Booking, Payment, Review, SystemSetting, AuditLog
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with initial data using Django ORM'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seed...')
        
        # 1. Clear existing data to prevent duplicates
        self.stdout.write('Clearing existing data...')
        Payment.objects.all().delete()
        Booking.objects.all().delete()
        ParkingSlot.objects.all().delete()
        ParkingLot.objects.all().delete()
        Review.objects.all().delete()
        AuditLog.objects.all().delete()
        SystemSetting.objects.all().delete()
        User.objects.all().delete()

        # 2. Create Users
        self.stdout.write('Creating users...')
        password = 'password123'
        
        # Admins
        # Note: create_superuser handles password hashing automatically
        User.objects.create_superuser(
            username='Admin User', 
            email='admin@demo.com', 
            password=password, 
            role='admin', 
            phone_number='254700000001'
        )
        User.objects.create_superuser(
            username='Sarah Admin', 
            email='sarah.admin@parkhub.com', 
            password=password, 
            role='admin', 
            phone_number='254700000002'
        )
        
        # Managers
        manager1 = User.objects.create_user(
            username='Demo Manager', 
            email='manager@demo.com', 
            password=password, 
            role='manager', 
            phone_number='254711000001'
        )
        User.objects.create_user(
            username='Jane Manager', 
            email='jane.manager@example.com', 
            password=password, 
            role='manager', 
            phone_number='254711000002'
        )
        
        # Drivers
        driver1 = User.objects.create_user(
            username='Demo Driver', 
            email='driver@demo.com', 
            password=password, 
            role='driver', 
            phone_number='254712345678'
        )
        User.objects.create_user(
            username='John Doe', 
            email='john.doe@example.com', 
            password=password, 
            role='driver', 
            phone_number='254720000001'
        )

        # 3. Create Parking Lots
        self.stdout.write('Creating parking lots...')
        lot1 = ParkingLot.objects.create(
            name='Main Campus Parking',
            location='University Way, Nairobi',
            manager=manager1,
            total_capacity=80,
            hourly_rate=50.00,
            is_24_7=True,
            amenities=["24/7 Security", "Covered Parking", "CCTV", "Lighting"],
            latitude=-1.2921,
            longitude=36.8219
        )
        
        lot2 = ParkingLot.objects.create(
            name='Westlands Mall Parking',
            location='Westlands, Nairobi',
            manager=manager1,
            total_capacity=120,
            hourly_rate=60.00,
            is_24_7=True,
            amenities=["Shopping Mall", "Covered", "EV Charging", "Car Wash"],
            latitude=-1.2676,
            longitude=36.8108
        )

        # 4. Create Slots for Lot 1
        self.stdout.write('Creating parking slots...')
        slots = []
        sections = ['A', 'B', 'C', 'D']
        for section in sections:
            for i in range(1, 21):
                slot_num = f"{section}{i:02d}"
                status = 'available'
                # Make some slots occupied/reserved for testing
                if i == 2: status = 'occupied'
                if i == 5: status = 'reserved'
                
                slots.append(ParkingSlot(
                    parking_lot=lot1,
                    slot_number=slot_num,
                    section=section,
                    status=status,
                    is_ev_charging=(i % 10 == 6),
                    is_disabled_friendly=(i % 10 == 1)
                ))
        ParkingSlot.objects.bulk_create(slots)

        # 5. Create a Booking
        self.stdout.write('Creating sample bookings...')
        # We need to fetch the slot instance to assign it
        slot_a02 = ParkingSlot.objects.get(parking_lot=lot1, slot_number='A02')
        
        Booking.objects.create(
            user=driver1,
            parking_slot=slot_a02,
            start_time=timezone.now() - timedelta(hours=1),
            end_time=timezone.now() + timedelta(hours=1),
            duration_hours=2,
            vehicle_number='KCA 123A',
            hourly_rate=50.00,
            total_amount=100.00,
            booking_reference='BK001',
            status='active'
        )

        # 6. System Settings
        self.stdout.write('Creating system settings...')
        SystemSetting.objects.create(
            setting_key='platform_name',
            setting_value='ParkHub',
            description='Platform Name'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database! You can now login.'))
