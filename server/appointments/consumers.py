from django.shortcuts import get_object_or_404

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from appointments.models import Appointment

from .serializers import AppointmentCreateSerializer, AppointmentUpdateSerializer, NestedAppointmentSerializer

class AppointmentConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def _create_appointment(self, data):
        serializer = AppointmentCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    @database_sync_to_async
    def _get_appointment_data(self, appt):
        return NestedAppointmentSerializer(appt).data

    @database_sync_to_async
    def _update_appointment(self, data):
        appt = get_object_or_404(Appointment, pk=data.get('id'))
        serializer = AppointmentUpdateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.update(appt, serializer.validated_data)

    @database_sync_to_async
    def _get_user_group(self, user):
        return user.groups.first().name

    @database_sync_to_async
    def _get_appt_ids(self, user):
        user_groups = user.groups.values_list('name', flat=True)
        if 'patient' in user_groups:
            apts = user.apts_as_patient.all()
        elif 'clinician' in user_groups:
            apts = user.apts_as_clin.all()
        return [str(apt.id) for apt in apts]

    async def connect(self):
        user = self.scope['user']

        if user.is_anonymous:
            await self.close()
        else:
            # adding user to appropriate socket groups
            group = await self._get_user_group(user)
            if group:
                await self.channel_layer.group_add(
                    group=f'{group}s',
                    channel=self.channel_name
                )
            for appt_id in await self._get_appt_ids(user):
                await self.channel_layer.group_add(
                    group=appt_id,
                    channel=self.channel_name
                )
            await self.accept()
    
    async def schedule_appointment(self, content, **kwargs):
        data = content.get('data')
        appt = await self._create_appointment(data)
        # serializer returns all appt data
        appt_data = await self._get_appointment_data(appt)

        await self.channel_layer.group_send(group='clinicians', message={
            'type': 'echo.message',
            'data': appt_data
        })

        await self.send_json({
            'type': 'echo.message',
            'data': appt_data,
        })

    async def update_appointment(self, content, **kwargs):
        data = content.get('data')
        updated_appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(updated_appt)

        await self.channel_layer.group_send(
            group=f'{updated_appt.id}',
            message={
                'type': 'echo.message',
                'data': appt_data
            }
        )

        await self.send_json({
            'type': 'echo.message',
            'data': appt_data
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
            for appt_id in await self._get_appt_ids(user):
                await self.channel_layer.group_discard(
                    group=appt_id,
                    channel=self.channel_name
                )
        await super().disconnect(code)
    
    async def echo_message(self, message):
        await self.send_json(message)

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'schedule.appointment':
            await self.schedule_appointment(content)
        elif message_type == 'update.appointment':
            await self.update_appointment(content)
        elif message_type == 'echo.message':
            await self.echo_message(content)
