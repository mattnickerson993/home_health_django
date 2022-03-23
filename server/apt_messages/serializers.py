from rest_framework import serializers

from .models import AptMessages
from appointments.serializers import NestedAppointmentSerializer
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    appointment = NestedAppointmentSerializer()
    author = UserSerializer()

    class Meta:
        model = AptMessages
        fields = '__all__'
        depth = 1
