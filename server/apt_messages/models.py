import uuid

from django.contrib.auth import get_user_model
from django.db import models

from appointments.models import Appointment

USER = get_user_model()


class AptMessages(models.Model):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    MESSAGE_STATUSES = [
        (ACTIVE, 'active'),
        (INACTIVE, 'inactive'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(USER, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(blank=True, null=True)
    status = models.CharField(choices=MESSAGE_STATUSES, max_length=255, blank=True, null=True, default=ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.email} : {self.content[:50]}"
