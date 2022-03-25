from rest_framework import generics, permissions

from .models import AptMessages
from .serializers import MessageSerializer


class MessageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        apt_id = self.kwargs['apt_id']
        print('apt_id', apt_id)
        return AptMessages.objects.filter(appointment_id=apt_id).order_by('created_at')
