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
        fields = '__all__'


class NestedAppointmentSerializer(serializers.ModelSerializer):

    clinician = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentDetailSerializer(serializers.ModelSerializer):

    clinician = UserSerializer()
    patient = UserSerializer()

    class Meta:
        model = Appointment
        fields = '__all__'
        depth = 1


class AppointmentUpdateSerializer(serializers.ModelSerializer):

    start_time = serializers.DateTimeField(required=False)
    canceled_at = serializers.DateTimeField(required=False)

    class Meta:
        model = Appointment
        fields = ('id', 'clinician', 'patient', 'status', 'start_time', 'canceled_at')
        extra_kwargs = {
            "start_time": {"required": False, "allow_null": True},
            "canceled_at": {"required": False, "allow_null": True}
        }
