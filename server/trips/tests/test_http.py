import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

PASSWORD = 'MonteCri$+o99'

USER = get_user_model()

default_user_request_data = {
    'email': 'test_email@email.com',
    'first_name': 'test_first',
    'last_name': 'test_last',
    'password1': PASSWORD,
    'password2': PASSWORD,
    'groups': [{'name': 'patient'}]
}

default_user_create_data = {
    'email': 'test_email1@email.com',
    'first_name': 'test_first1',
    'last_name': 'test_last1',
    'password': PASSWORD,
}