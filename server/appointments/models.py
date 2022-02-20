import uuid

from django.contrib.auth import get_user_model
from django.db import models

USER = get_user_model()

class Appointment(models.Model):
    COMPLETE = 'COMPLETE'
    CANCELED = 'CANCELED'
    IN_PROGRESS = 'IN_PROGRESS'
    REQUESTED = 'REQUESTED'
    RESCHEDULED = 'RESCHEDULED'
    SCHEDULED = 'SCHEDULED'
    STARTED = 'STARTED'

    APPOINTMENT_STATUSES = [
        (COMPLETE, 'complete'),
        (CANCELED,'canceled'),
        (IN_PROGRESS, 'in_progress'),
        (REQUESTED,'requested'),
        (RESCHEDULED, 'rescheduled'),
        (SCHEDULED, 'scheduled'),
        (STARTED, 'started'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clinician = models.ForeignKey(
        USER,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='apts_as_clin',
    )
    patient = models.ForeignKey(
        USER,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='apts_as_patient',
    )
    status = models.CharField(choices=APPOINTMENT_STATUSES, max_length=40, default=REQUESTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    canceled_at = models.DateTimeField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    length = models.IntegerField(null=True, blank=True)
    end_time = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f'{self.id}'
