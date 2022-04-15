from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from appointments.models import Appointment

from .models import AptMessages
from .serializers import MessageSerializer


class MessageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        # only the two chat members can view
        apt_id = self.kwargs['apt_id']
        apt = Appointment.objects.get(id=apt_id)
        user = self.request.user
        if user == apt.clinician or user == apt.patient:
            return AptMessages.objects.filter(
            appointment_id=apt_id,
            status='ACTIVE'
        ).order_by('created_at')
        else:
            raise PermissionDenied
