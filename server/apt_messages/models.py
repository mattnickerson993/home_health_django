import uuid

from django.contrib.auth import get_user_model
from django.db import models

from appointments.models import Appointment

USER = get_user_model()


class AptMessages(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(blank=True, null=True)
