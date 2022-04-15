from rest_framework import generics, permissions

from .permissions import InvolvedInAppointmentOrStaff, IsClinician
from .models import Appointment
from .serializers import (
    AppointmentDetailSerializer,
    AppointmentListSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
)


class AppointmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentListSerializer

    def get_queryset(self):
        user = self.request.user
        group = user.group
        status_filter = {
            'status__in': ['SCHEDULED', 'IN_ROUTE', 'ARRIVED']
        }
        if group == 'clinician':
            filter = {
                "clinician_id": user.id,
            }
        else:
            filter = {
                "patient_id": user.id,
            }
        filter.update(status_filter)
        return Appointment.objects.filter(**filter)


class AppointmentPastListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentListSerializer

    def get_queryset(self):
        user = self.request.user
        group = user.group
        past_statuses = ['COMPLETE', 'CANCELED']
        if group == 'clinician':
            filter = {
                "clinician_id": user.id,
                "status__in": past_statuses
            }
        else:
            filter = {
                "patient_id": user.id,
                "status__in": past_statuses
            }
        return Appointment.objects.filter(**filter)


class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get_queryset(self):
        return Appointment.objects.all()


class AppointmentDetailView(generics.RetrieveAPIView):
    permission_classes = [InvolvedInAppointmentOrStaff]
    serializer_class = AppointmentDetailSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'appointment_id'
    queryset = Appointment.objects.all()


class AppointmentUpdateView(generics.UpdateAPIView):
    permission_classes = [InvolvedInAppointmentOrStaff]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentUpdateSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'appointment_id'


class AppointmentAvailablePatientView(generics.ListAPIView):
    permission_classes = [IsClinician]
    queryset = Appointment.objects.filter(status=Appointment.REQUESTED).order_by('-id')
    serializer_class = AppointmentListSerializer
