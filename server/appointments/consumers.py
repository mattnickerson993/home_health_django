from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .serializers import AppointmentCreateSerializer, NestedAppointmentSerializer

class AppointmentConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def _create_appointment(self, data):
        serializer = AppointmentCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    # new
    @database_sync_to_async
    def _get_appointment_data(self, trip):
        return NestedAppointmentSerializer(trip).data

    @database_sync_to_async
    def _get_user_group(self, user):
        return user.groups.first().name

    async def connect(self):
        user = self.scope['user']

        if user.is_anonymous:
            await self.close()
        else:
            group = await self._get_user_group(user)
            if group:
                await self.channel_layer.group_add(
                    group=f'{group}s',
                    channel=self.channel_name
                )
            await self.accept()
    
    async def schedule_appointment(self, content, **kwargs):
        data = content.get('data')
        appt = await self._create_appointment(data)
        appt_data = await self._get_appointment_data(appt)

        await self.send_json({
          'type': 'echo.message',
          'data': appt_data,
        })

    async def disconnect(self, code):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            group = await self._get_user_group(user)
            if group:
                await self.channel_layer.group_discard(
                    group=f'{group}s',
                    channel=self.channel_name
                )
        await super().disconnect(code)

    async def echo_message(self, message):
        await self.send_json(message)

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        print('receiving json')
        if message_type == 'schedule.appointment':
            print('awaiting appt')
            await self.schedule_appointment(content)
        elif message_type == 'echo.message':
            await self.echo_message(content)
