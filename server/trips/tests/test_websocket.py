from urllib import response
import pytest

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from rest_framework_simplejwt.tokens import AccessToken
from config.middleware import User

from config.routing import application

# defaults
default_user_create_data = {
    'email': 'test_email1@email.com',
    'first_name': 'test_first1',
    'last_name': 'test_last1',
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
    async def test_can_connect_to_server(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user('driver', **default_user_create_data)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/?token={access}'
        )
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()

    
    async def test_can_send_and_receive_messages(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user('driver', **default_user_create_data)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/?token={access}'
        )

        await communicator.connect()

        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }

        await communicator.send_json_to(message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()


    async def test_can_send_and_receive_group_message(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user('driver', **default_user_create_data)

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/?token={access}'
        )

        await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send('test', message=message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()
    
    async def test_join_driver_pool(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user('driver', **default_user_create_data)
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/home_health/?token={access}'
        )

        await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send('drivers', message=message)
        # user is a driver and should receive message to drivers
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()


    async def test_cannot_connect_to_socket(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator = WebsocketCommunicator(
            application=application,
            path='/home_health/'
        )
        connected, _ = await communicator.connect()
        assert connected is False
        await communicator.disconnect()