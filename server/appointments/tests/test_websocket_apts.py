from datetime import datetime, timedelta
import json
from urllib import response
import pytest

from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from rest_framework_simplejwt.tokens import AccessToken
from config.middleware import User

from config.routing import application

# defaults
default_patient_create_data = {
    'email': 'test_email1@email.com',
    'first_name': 'test_first1',
    'last_name': 'test_last1',
    'password': 'MonteCri$To9',
}

default_clinician_create_data = {
    'email': 'test_email2@email.com',
    'first_name': 'test_first2',
    'last_name': 'test_last2',
    'password': 'MonteCri$To9',
}


TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    }
}

USER = get_user_model()

# database calls are synchronous - prevents blocking main event loop
# opens thread to handle
@database_sync_to_async
def create_user(group, **kwargs):
    user = User.objects.create_user(**kwargs)
    group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(group)
    user.save()
    access = AccessToken.for_user(user)
    return user, access

# mark sets metadata on all test methods in test class
# also treat tests as coroutines
@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSocket:
    async def test_schedule_appointment(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        patient, access = await create_user('patient', **default_patient_create_data)
        clinician, _  = await create_user('clinician', **default_clinician_create_data)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/appointments/?token={access}'
        )
        data = json.dumps({
            'clinician': str(clinician.id),
            'patient': str(patient.id),
            'start_time': datetime.now() + timedelta(days=7),
            'length': 60,
        }, cls=DjangoJSONEncoder)
        print(json.loads(data))
        connected, _ = await communicator.connect()
        await communicator.send_json_to({
            'type': 'schedule.appointment',
            'data': json.loads(data),
        })
        response = await communicator.receive_json_from()
        response_data = response.get('data')
        assert response_data['id'] is not None
        assert response_data['clinician']['email'] == default_clinician_create_data['email']
        assert response_data['patient']['email'] == default_patient_create_data['email']
        assert response_data['status'] == 'REQUESTED'
   
        await communicator.disconnect()