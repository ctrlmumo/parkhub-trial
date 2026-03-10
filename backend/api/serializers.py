from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ParkingLot, ParkingSlot, Booking, Payment, Review, AuditLog

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'phone_number', 'status')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLot
        fields = '__all__'
        read_only_fields = ('manager', 'created_at', 'updated_at')

class ParkingSlotSerializer(serializers.ModelSerializer):
    lot_details = ParkingLotSerializer(source='parking_lot', read_only=True)
    class Meta:
        model = ParkingSlot
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    slot_details = ParkingSlotSerializer(source='parking_slot', read_only=True)
    class Meta:
        model = Booking
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    class Meta:
        model = AuditLog
        fields = '__all__'
