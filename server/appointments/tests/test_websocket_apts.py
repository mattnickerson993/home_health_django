from datetime import datetime, timedelta
import json
from django.conf import settings
import pytest

from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from rest_framework_simplejwt.tokens import AccessToken

from appointments.models import Appointment
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
    user = USER.objects.create_user(**kwargs)
    group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(group)
    user.save()
    access = AccessToken.for_user(user)
    return user, access


@database_sync_to_async
def create_appt(clinician, patient):
    return Appointment.objects.create(
        clinician_id=clinician.id,
        patient_id=patient.id,
        start_time=datetime.now() + timedelta(days=7),
        length=60,
    )


# mark sets metadata on all test methods in test class
# also treat tests as coroutines
@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSocket:

    settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

    async def test_schedule_appointment(self):
        patient, access = await create_user('patient', **default_patient_create_data)
        clinician, _ = await create_user('clinician', **default_clinician_create_data)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/appointments/?token={access}'
        )
        # account for correct django datetime fmt
        data = json.dumps({
            'clinician': str(clinician.id),
            'patient': str(patient.id),
            'start_time': datetime.now() + timedelta(days=7),
            'length': 60,
        }, cls=DjangoJSONEncoder)

        connected, _ = await communicator.connect()
        await communicator.send_json_to({
            'type': 'schedule.appointment',
            'data': json.loads(data),  # back to dictionary
        })
        response = await communicator.receive_json_from()
        response_data = response.get('data')
        assert response_data['id'] is not None
        assert response_data['clinician']['email'] == default_clinician_create_data['email']
        assert response_data['patient']['email'] == default_patient_create_data['email']
        assert response_data['status'] == 'REQUESTED'

        await communicator.disconnect()

    async def test_clinician_alerted_on_appt_schedule(self):
        patient, access = await create_user('patient', **default_patient_create_data)
        clinician, _  = await create_user('clinician', **default_clinician_create_data)

        # connect to test channel as clinician to receive broadcast msg
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group='clinicians',
            channel='test_channel'
        )

        # schedule appointment as patient
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/appointments/?token={access}'
        )
        # account for correct django datetime fmt
        data = json.dumps({
            'clinician': str(clinician.id),
            'patient': str(patient.id),
            'start_time': datetime.now() + timedelta(days=7),
            'length': 60,
        }, cls=DjangoJSONEncoder)

        connected, _ = await communicator.connect()
        await communicator.send_json_to({
            'type': 'schedule.appointment',
            'data': json.loads(data),  # back to dictionary (dumb)
        })

        # monitor for broadcast message as clinician
        res = await channel_layer.receive('test_channel')
        response_data = res.get('data')

        assert response_data['id'] is not None
        assert response_data['clinician']['email'] == default_clinician_create_data['email']
        assert response_data['patient']['email'] == default_patient_create_data['email']
        assert response_data['status'] == 'REQUESTED'

        await communicator.disconnect()

    async def test_create_appt_group(self):

        # create appt
        patient, access = await create_user('patient', **default_patient_create_data)
        clinician, _ = await create_user('clinician', **default_clinician_create_data)
        appt = await create_appt(clinician, patient)
        # patient and clinician now automatically subscribed to appointment groups by appt_id

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/appointments/?token={access}'
        )
        connected, _ = await communicator.connect()

        message = {
            'type': 'echo.message',
            'data': 'This is a test message.',
        }

        # appt group logic
        channel_layer = get_channel_layer()
        await channel_layer.group_send(f'{appt.id}', message=message)

        # patient receives message as member of appt group
        resp = await communicator.receive_json_from()
        assert resp == message

        await communicator.disconnect()

    async def test_clin_can_update_patient(self):

        # create appt
        patient, access = await create_user('patient', **default_patient_create_data)
        clinician, clin_access = await create_user('clinician', **default_clinician_create_data)
        appt = await create_appt(clinician, patient)

        # subscribed to appt channel
        channel_layer = get_channel_layer()
        await channel_layer.group_add(f'{appt.id}', channel='test_channel')

        # connect as clinician
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/appointments/?token={clin_access}'
        )
        await communicator.connect()

        # send message as clinician to schedule appt
        message = {
            'type': 'update.appointment',
            'data': {
                'id': f'{appt.id}',
                'clinician': f'{clinician.id}',
                'patient': f'{patient.id}',
                'status': f'{Appointment.SCHEDULED}'
            }
        }

        await communicator.send_json_to(message)

        response = await channel_layer.receive('test_channel')
        data = response.get('data')
        assert data['id'] == f'{appt.id}'
        assert data['status'] == f'{Appointment.SCHEDULED}'
        await communicator.disconnect()
