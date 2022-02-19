from rest_framework import serializers

from .models import Trip
from users.serializers import UserSerializer


class TripListSerializer(serializers.ModelSerializer):
    driver = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Trip
        fields = '__all__'
        depth = 1


class TripCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = ('driver', 'patient', 'start_location', 'destination')


class TripDetailSerializer(serializers.ModelSerializer):

    driver = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Trip
        fields = '__all__'
        depth = 1


class TripUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = ('id', 'driver', 'patient', 'start_location', 'destination', 'status')
