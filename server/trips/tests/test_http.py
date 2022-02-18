import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from trips.models import Trip

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


def create_test_user(**kwargs):
    return USER.objects.create_user(**kwargs)

class Http_Trip_Testing(APITestCase):

    def logIn(self):
        user = create_test_user(**default_user_create_data)
        response = self.client.post(reverse('auth:log_in'), data={
            'email': user.email,
            'password': PASSWORD
        }, format='json')

        self.access = response.data['access']

    # def create_trip(self):
    #     Trip.objects.

    # def setUp(self):
    #     self.logIn()

    
    # def test_list_trips(self):
         
