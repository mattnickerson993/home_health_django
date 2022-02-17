import uuid

from django.conf import settings
from django.db import models


class Trip(models.Model):
    ARRIVED = 'ARRIVED'
    CANCELED = 'CANCELED'
    IN_PROGRESS = 'IN_PROGRESS'
    REQUESTED = 'REQUESTED'
    RESCHEDULED = 'RESCHEDULED'
    SCHEDULED = 'SCHEDULED'

    TRIP_STATUSES = [
        (ARRIVED, 'arrived'),
        (CANCELED,'canceled'),
        (IN_PROGRESS, 'in_progress'),
        (REQUESTED,'requested'),
        (RESCHEDULED, 'rescheduled'),
        (SCHEDULED, 'scheduled')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name='trips_as_driver',
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name='trips_as_patient',
    )
    status = models.CharField(choices=TRIP_STATUSES, max_length=40, default=REQUESTED)
    current_location = models.CharField(blank=True, null=True, max_length=255)
    start_location = models.CharField(blank=True, null=True, max_length=255)
    destination = models.CharField(blank=True, null=True, max_length=255)

    def __str__(self):
        return f"{self.id}"
