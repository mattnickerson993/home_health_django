from django.contrib import admin

from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    fields = (
        'id', 'driver', 'patient', 'status', 'current_location',
        'start_location', 'destination', 'canceled_at'
    )

    list_display = (
        'id', 'driver', 'patient', 'status', 'current_location',
        'start_location', 'destination', 'created_at', 'updated_at',
        'canceled_at',
    )

    list_filter = (
        'status',
        'driver',
        'patient'
    )

    readonly_fields = (
        'id', 'created_at', 'updated_at'
    )