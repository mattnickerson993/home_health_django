from rest_framework import generics, permissions
from rest_framework.throttling import UserRateThrottle

from .serializers import (
    AppointmentListSerializer,
    AppointmentCreateSerializer,
    AppointmentDetailSerializer,
    AppointmentUpdateSerializer,
)
from .models import Appointment


class AppointmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentListSerializer

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status')
        return Appointment.objects.filter(clinician_id=user.id, status=status)


class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get_queryset(self):
        return Appointment.objects.all()


class AppointmentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = Appointment
    lookup_field = 'id'
    lookup_url_kwarg = 'appointment_id'
    queryset = Appointment.objects.all()


class AppointmentUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    queryset = Appointment.objects.all()
    serializer_class = AppointmentUpdateSerializer

    lookup_field = 'id'
    lookup_url_kwarg = 'appointment_id'


class AppointmentAvailablePatientView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.filter(status=Appointment.REQUESTED).order_by('-id')
    serializer_class = AppointmentListSerializer
