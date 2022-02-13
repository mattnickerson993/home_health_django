from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Group
        fields = ('name',)


class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    groups = GroupSerializer(many=True)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def create(self, validated_data):
        group_list = validated_data.pop('groups')
        groups = [Group.objects.get_or_create(name = group['name'].lower())[0] for group in group_list]
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        user = self.Meta.model.objects.create_user(**data)
        user.groups.set(groups)
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'password1', 'password2',
            'first_name', 'last_name', 'groups'
        )
        read_only_fields = ('id',)
