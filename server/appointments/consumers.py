from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from appointments.models import Appointment
from apt_messages.models import AptMessages
from users.serializers import UserListSerializer
from .serializers import AppointmentCreateSerializer, AppointmentUpdateSerializer, NestedAppointmentSerializer
from apt_messages.serializers import MessageCreateSerializer, MessageSerializer


User = get_user_model()


class AppointmentConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def _get_available_clinicians(self):
        users = User.objects.filter(groups__name="clinician")
        serializer = UserListSerializer(users, many=True)
        return serializer.data

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
    
    @database_sync_to_async
    def _create_chat_msg(self, data):
        serializer = MessageCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    @database_sync_to_async
    def _get_chat_msg(self, msg):
        return MessageSerializer(msg).data

    @database_sync_to_async
    def _check_apt_valid(self, user):
        # patient cant asked for another appointment when one is not resolved
        current_apts = Appointment.objects.filter(patient_id=user.id, status__in=[
            Appointment.REQUESTED,
            Appointment.IN_PROGRESS,
            Appointment.SCHEDULED,
            Appointment.STARTED
        ]).count()
        if current_apts > 0:
            return False
        else:
            return True
    
    @database_sync_to_async
    def _check_clin_apt_valid(self, user):
        # patient cant asked for another appointment when one is not resolved
        current_apts = Appointment.objects.filter(clinician_id=user.id, status__in=[
            Appointment.IN_PROGRESS,
            Appointment.SCHEDULED,
            Appointment.STARTED
        ]).count()
        if current_apts > 0:
            return False
        else:
            return True

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

    async def search_clinicians(self):
        clinicians = await self._get_available_clinicians()
        await self.send_json(clinicians)

    async def create_apt(self, content, **kwargs):
        data = content.get('data')
        valid = await self._check_apt_valid(self.scope['user'])
        if not valid:
            await self.send_json({
                'type': 'apt.requested.fail',
                'msg': 'You must complete your current appointment before asking for another'
            })
            return

        appt = await self._create_appointment(data)
        appt_data = await self._get_appointment_data(appt)
        id = appt.id
        # add patient to apt group
        await self.channel_layer.group_add(
            group=f"{id}",
            channel=self.channel_name
        )

        await self.channel_layer.group_send(group='clinicians', message={
            'type': 'apt.requested.clins',
            'data': appt_data
        })

        await self.send_json({
            'type': 'apt.requested.success',
            'data': appt_data,
        })

    async def apt_requested_clins(self, message):
        await self.send_json(
            {
                'type': 'apt.requested.clins',
                'data': message.get('data')
            }
        )

    async def apt_booked_msg(self, message):
        await self.send_json(
            {
                'type': 'apt.booked.msg',
                'data': message.get('data')
            }
        )

    async def create_new_chat_msg(self, content, **kwargs):
        user = self.scope['user']
        data = content.get('data')
        data.update({'author': user.id})
        msg = await self._create_chat_msg(data)
        msg_data = await self._get_chat_msg(msg)

        await self.channel_layer.group_send(
            group=f'{msg.appointment.id}',
            message={
                'type': "chat.message.created",
                'data': msg_data
            }
        )
        return

    async def chat_message_created(self, message):

        await self.send_json(
            {
                'type': 'chat.message.created',
                'data': message.get('data')
            }
        )

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

    async def clin_book_apt(self, content, **kwargs):
        data = content.get('data')
        valid = await self._check_clin_apt_valid(self.scope['user'])
        if not valid:
            await self.send_json({
                'type': 'apt.requested.fail',
                'msg': 'You must complete your current appointment before booking another'
            })
            return

        appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(appt)
        # add clinician to apt group
        await self.channel_layer.group_add(
            group=f"{appt.id}",
            channel=self.channel_name
        )

        await self.channel_layer.group_send(
            group=f"{appt.id}",
            message={
                'type': 'apt.booked.msg',
                'data': appt_data
            }
        )

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
        elif message_type == 'create.apt':
            await self.create_apt(content)
        elif message_type == 'clin.book.apt':
            await self.clin_book_apt(content)
        elif message_type == 'get.clinicians':
            await self.search_clinicians()
        elif message_type == 'update.appointment':
            await self.update_appointment(content)
        elif message_type == 'echo.message':
            await self.echo_message(content)
        elif message_type == 'create.new_chat_msg':
            await self.create_new_chat_msg(content)
