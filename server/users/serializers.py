from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from django.conf import settings

from rest_framework import serializers

USER = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)
        # overrides unique constraint in nested serializer
        # https://medium.com/django-rest-framework/dealing-with-unique-constraints-in-nested-serializers-dade33b831d9
        extra_kwargs = {
            'name': {'validators': []},
        }


class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    group = serializers.CharField()
    photo = serializers.ImageField(max_length=None, use_url=True)

    def validate(self, data):

        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def create(self, validated_data):
        group = validated_data.pop('group')
        group = Group.objects.get_or_create(name=group.lower())[0]

        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        user = self.Meta.model.objects.create_user(**data)
        user.groups.add(group)
        user.save()

        return user

    class Meta:
        model = USER
        fields = (
            'id', 'email', 'password1', 'password2',
            'first_name', 'last_name', 'group', 'photo'
        )
        read_only_fields = ('id',)


class UserFullImageSerializer(serializers.ModelSerializer):
    # read only field
    photo_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = USER
        fields = ('photo_url',)

    def get_image_url(self, obj):
        # needed to display chat images --- would change if media files hosted via s3 ect
        return f"{Site.objects.get_current().domain}{obj.photo.url}"


class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model = USER
        fields = ('id', 'email', 'first_name', 'last_name', 'group')
        depth = 1
