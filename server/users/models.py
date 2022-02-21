from tkinter import FLAT
from django.contrib.auth.models import AbstractUser
from django.db import models

from users.managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, max_length=255)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    # for convenience
    @property
    def group(self):
        groups = self.groups.values_list('name', FLAT=True)
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
