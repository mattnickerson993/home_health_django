from rest_framework import serializers

from .models import AptMessages
from appointments.serializers import NestedAppointmentSerializer
from users.serializers import UserSerializer, UserFullImageSerializer


class MessageSerializer(serializers.ModelSerializer):
    appointment = NestedAppointmentSerializer()
    author = UserFullImageSerializer()

    class Meta:
        model = AptMessages
        fields = '__all__'
        depth = 1


class MessageCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = AptMessages
        fields = '__all__'
