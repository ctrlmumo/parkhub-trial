from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ParkingLot, ParkingSlot, Booking, Payment, Review, AuditLog, SystemSetting

# 1. Register the custom User model (if you want to see custom fields like 'role')
admin.site.register(User, UserAdmin)

# 2. Register all your platform models
admin.site.register(ParkingLot)
admin.site.register(ParkingSlot)
admin.site.register(Booking)
admin.site.register(Payment)
admin.site.register(Review)
admin.site.register(AuditLog)
admin.site.register(SystemSetting)