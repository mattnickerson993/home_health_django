import base64
from io import BytesIO
import json

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from PIL import Image

PASSWORD = 'MonteCri$+o99'

USER = get_user_model()


def create_test_img():
    data = BytesIO()
    Image.new('RGB', (100, 100)).save(data, 'PNG')
    data.seek(0)
    return SimpleUploadedFile('photo.png', data.getvalue())


default_user_request_data = {
    'email': 'test_email@email.com',
    'first_name': 'test_first',
    'last_name': 'test_last',
    'password1': PASSWORD,
    'password2': PASSWORD,
    'group': 'patient',
    'photo': create_test_img(),
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
        
        response = self.client.post(reverse('auth:sign_up'), data=default_user_request_data)
        user = USER.objects.prefetch_related('groups').last()
        groups = [group.name for group in user.groups.all()]
        response_group = response.data['group']
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['email'], user.email)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response_group, groups[0])
        self.assertIsNotNone(user.photo)

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

    def test_base_auth_workflow(self):
        
        # a - login and get creds
        user = create_test_user(**default_user_create_data)
        response = self.client.post(reverse('auth:log_in'), data={
            'email': user.email,
            'password': PASSWORD
        }, format='json')
        access, refresh = response.data['access'], response.data['refresh']
        # b - verify access

        verify_response = self.client.post(reverse('auth:token_verify'), data={
            'token': access
        }, format='json')

        self.assertEqual(status.HTTP_200_OK, verify_response.status_code)

        # c - call refresh view
        refresh_response = self.client.post(reverse('auth:token_refresh'), data={
            'refresh': refresh
        }, format='json')

        # d - verify new access token
        new_access = refresh_response.data['access']
        verify_new_response = self.client.post(reverse('auth:token_verify'), data={
            'token': new_access
        }, format='json')
        self.assertEqual(status.HTTP_200_OK, verify_new_response.status_code)

        # e - logout
        logout_response = self.client.post(reverse('auth:logout'), data={
            'refresh': refresh
        }, format='json')
        self.assertEqual(status.HTTP_200_OK, logout_response.status_code)

        # f - calling refresh should fail as token is blacklisted
        failed_refresh_response = self.client.post(reverse('auth:token_refresh'), data={
            'refresh': refresh
        }, format='json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, failed_refresh_response.status_code)