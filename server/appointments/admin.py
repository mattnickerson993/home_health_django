from django.contrib import admin

from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    fields = (
        'id', 'clinician', 'patient', 'status', 'start_time', 'length'
    )

    list_display = (
        'id', 'clinician', 'patient', 'status',
        'start_time', 'length', 'end_time', 
        'created_at', 'updated_at', 'canceled_at',
    )

    list_filter = (
        'status',
        'clinician',
        'patient'
    )

    readonly_fields = (
        'id', 'created_at', 'updated_at'
    )