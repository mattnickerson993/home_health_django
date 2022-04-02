from django.contrib.auth.models import AbstractUser
from django.db import models

from users.managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, max_length=255)
    photo = models.ImageField(upload_to='profile_pics', null=True, blank=True)
    current_lat = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    current_lon = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    # for convenience
    @property
    def group(self):
        groups = self.groups.values_list('name', flat=True)
        if 'patient' in groups:
            return 'patient'
        else:
            return 'clinician'

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email
