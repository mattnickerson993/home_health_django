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

;
default_user_create_data = {
    'email': 'test_email1@email.com',
    'first_name': 'test_first1',
    'last_name': 'test_last1',
    'password': PASSWORD,
}

default_user_two_create_data = {
    'email': 'test_email2@email.com',
    'first_name': 'test_first2',
    'last_name': 'test_last2',
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

    def setUp(self):
        self.trips = []
        self.logIn()
        # create second user
        create_test_user(**default_user_two_create_data)
        self.create_trip()

    def create_trip(self):
        self.trip_one = Trip.objects.create(
            patient_id=1,
            driver_id=2,
            current_location='8109 Oak Crest Lane',
            destination='11662 Captain Rhett lane'
        )
        self.trips.append(self.trip_one)

    def test_list_trips(self):
        response = self.client.get(reverse('api_v1:trips:trips_list'),
            HTTP_AUTHORIZATION=f'JWT {self.access}'
        )
        data = response.data
        
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        expected_ids = [str(trip.id) for trip in self.trips]
        returned_ids = [str(trip.get('id')) for trip in data]
        self.assertEqual(expected_ids, returned_ids)
