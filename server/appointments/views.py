from rest_framework import generics, permissions

from .serializers import AppointmentListSerializer, AppointmentCreateSerializer
from .models import Appointment


class AppointmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentListSerializer

    def get_queryset(self):
        return Appointment.objects.all()


class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get_queryset(self):
        return Appointment.objects.all()

# class TripDetailView(generics.RetrieveAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = TripDetailSerializer
#     lookup_field = 'id'
#     lookup_url_kwarg = 'trip_id'
#     queryset = Trip.objects.all()


# class TripUpdateView(generics.UpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     throttle_classes = [UserRateThrottle]

#     queryset = Trip.objects.all()
#     serializer_class = TripUpdateSerializer

#     lookup_field = 'id'
#     lookup_url_kwarg = 'trip_id'