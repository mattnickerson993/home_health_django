from rest_framework import generics, permissions
from rest_framework.throttling import UserRateThrottle

from .serializers import TripListSerializer, TripCreateSerializer, TripDetailSerializer, TripUpdateSerializer
from .models import Trip


class TripListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripListSerializer

    def get_queryset(self):
        return Trip.objects.all()


class TripCreateView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripCreateSerializer

    def get_queryset(self):
        return Trip.objects.all()


class TripDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripDetailSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    queryset = Trip.objects.all()


class TripUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    queryset = Trip.objects.all()
    serializer_class = TripUpdateSerializer

    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
