from rest_framework import generics, permissions

from .serializers import TripListSerializer, TripCreateSerializer
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
