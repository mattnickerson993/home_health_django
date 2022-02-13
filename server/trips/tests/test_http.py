from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

PASSWORD = 'MonteCri$+o99'


default_user_data = {
    'email': 'test_email@email.com',
    'first_name': 'test_first',
    'last_name': 'test_last',
    'password1': PASSWORD,
    'password2': PASSWORD,
    'group': 'patient',
}


def create_test_user(**kwargs):
    return get_user_model.objects.create(**kwargs)


class AuthenticationTest(APITestCase):
    def test_user_can_sign_up(self):
        response = self.client.post(reverse('auth:sign_up'), data={
            'email': 'test_email@email.com',
            'first_name': 'test_first',
            'last_name': 'test_last',
            'password1': PASSWORD,
            'password2': PASSWORD,
            'groups': [{'name':'patient'}],
        }, format='json')
        
        user = get_user_model().objects.prefetch_related('groups').last()
        groups = [group.name for group in user.groups.all()]
        response_groups = [group['name'] for group in response.data['groups']]
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['email'], user.email)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['last_name'], user.last_name)
        self.assertEqual(response_groups, groups)
