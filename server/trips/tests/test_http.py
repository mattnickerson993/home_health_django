import base64
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


def create_test_user(**kwargs):
    return USER.objects.create_user(**kwargs)


class AuthenticationTest(APITestCase):
    def test_user_can_sign_up(self):
        response = self.client.post(reverse('auth:sign_up'), data=default_user_request_data, format='json')
        user = USER.objects.prefetch_related('groups').last()
        groups = [group.name for group in user.groups.all()]
        response_groups = [group['name'] for group in response.data['groups']]
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['email'], user.email)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response_groups, groups)

    def test_user_can_log_in(self):
        user = create_test_user(**default_user_create_data)
        # group, _ = Group.objects.get_or_create(name='patient')
        # user.groups.add(group)
        response = self.client.post(reverse('auth:log_in'), data={
            'email': user.email,
            'password': PASSWORD
        }, format='json')

        access = response.data['access']
        header, payload, signature = access.split('.')
        decoded_payload = base64.b64decode(f'{payload}==')
        payload_data = json.loads(decoded_payload)

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIsNotNone(response.data['refresh'])
        self.assertEqual(payload_data['id'], user.id)
