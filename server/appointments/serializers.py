from rest_framework import serializers

from .models import Appointment
from users.serializers import UserSerializer


class AppointmentListSerializer(serializers.ModelSerializer):
    clinician = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Appointment
        fields = '__all__'
        depth = 1

class AppointmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ('clinician', 'patient', 'start_time', 'length')


class NestedAppointmentSerializer(serializers.ModelSerializer):

    clinician = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Appointment
        fields = '__all__'
