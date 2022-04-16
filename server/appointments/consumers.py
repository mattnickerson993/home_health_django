from datetime import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from appointments.models import Appointment
from apt_messages.serializers import MessageCreateSerializer, MessageSerializer
from .serializers import AppointmentCreateSerializer, AppointmentUpdateSerializer, NestedAppointmentSerializer
from users.serializers import UserListSerializer


User = get_user_model()


class AppointmentConsumer(AsyncJsonWebsocketConsumer):

    # database helpers

    @database_sync_to_async
    def _check_apt_valid(self, user, group):

        # patient or clinician cannot commit to another apt when one is unresolved

        statuses = [
            Appointment.REQUESTED, Appointment.IN_ROUTE,
            Appointment.SCHEDULED, Appointment.ARRIVED
        ]

        if group == 'clinician':
            statuses.remove(Appointment.REQUESTED)

        filters = {
            f"{group}_id": user.id,
            'status__in': statuses
        }

        current_apts = Appointment.objects.filter(**filters).count()

        return current_apts == 0

    @database_sync_to_async
    def _create_appointment(self, data):
        serializer = AppointmentCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    @database_sync_to_async
    def _create_chat_msg(self, data):
        serializer = MessageCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    @database_sync_to_async
    def _get_available_clinicians(self):
        users = User.objects.filter(groups__name="clinician")
        serializer = UserListSerializer(users, many=True)
        return serializer.data

    @database_sync_to_async
    def _get_appointment_data(self, appt):
        return NestedAppointmentSerializer(appt).data

    @database_sync_to_async
    def _get_appt_ids(self, user):
        user_groups = user.groups.values_list('name', flat=True)
        if 'patient' in user_groups:
            apts = user.apts_as_patient.all()
        elif 'clinician' in user_groups:
            apts = user.apts_as_clin.all()
        return [str(apt.id) for apt in apts]

    @database_sync_to_async
    def _get_chat_msg(self, msg):
        return MessageSerializer(msg).data

    @database_sync_to_async
    def _get_user_group(self, user):
        return user.groups.first().name

    @database_sync_to_async
    def _update_appointment(self, data):
        appt = get_object_or_404(Appointment, pk=data.get('id'))
        serializer = AppointmentUpdateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.update(appt, serializer.validated_data)

    # main consumer logic -- starting with connect and disconnect
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

    async def disconnect(self, code):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            group = await self._get_user_group(user)
            # unsubscribe user from all socket  groups
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

    async def cancel_apt(self, content, **kwargs):
        # apt marked canceled by patient
        data = content.get('data')
        data.update({'canceled_at': datetime.now()})
        updated_appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(updated_appt)

        await self.channel_layer.group_send(
            group=f"{updated_appt.id}",
            message={
                'type': 'patient.canceled',
                'data': appt_data
            }
        )

    async def clin_arrived(self, content, **kwargs):
        # clin arrived at location
        data = content.get('data')
        data.update({'start_time': datetime.now()})
        updated_appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(updated_appt)

        await self.channel_layer.group_send(
            group=f"{updated_appt.id}",
            message={
                'type': 'clin.arrival.update',
                'data': appt_data
            }
        )

    async def clin_begin_nav(self, content, **kwargs):
        # clinician on there way
        data = content.get('data')
        updated_appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(updated_appt)

        await self.channel_layer.group_send(
            group=f"{updated_appt.id}",
            message={
                'type': 'clin.on.way',
                'data': appt_data
            }
        )

    async def clin_book_apt(self, content, **kwargs):
        # called when clinicians accepts patient request for apt
        data = content.get('data')
        group = await self._get_user_group(self.scope['user'])
        valid = await self._check_apt_valid(self.scope['user'], group)
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

    async def clin_complete(self, content, **kwargs):
        # apt marked complete by clinician
        data = content.get('data')
        updated_appt = await self._update_appointment(data)
        appt_data = await self._get_appointment_data(updated_appt)

        await self.channel_layer.group_send(
            group=f"{updated_appt.id}",
            message={
                'type': 'clin.complete.update',
                'data': appt_data
            }
        )

    async def create_apt(self, content, **kwargs):
        # called when patient creates apt
        data = content.get('data')
        group = await self._get_user_group(self.scope['user'])
        valid = await self._check_apt_valid(self.scope['user'], group)
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
        # broadcast request to all clins
        await self.channel_layer.group_send(group='clinicians', message={
            'type': 'apt.requested.clins',
            'data': appt_data
        })

        await self.send_json({
            'type': 'apt.requested.success',
            'data': appt_data,
        })

    async def create_new_chat_msg(self, content, **kwargs):
        # patient/clinician create new msg
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

    async def update_apt_coords(self, content, **kwargs):
        # used to tell patient where clinician is located
        data = content.get('data')
        apt_id = data.get('apt_id')

        await self.channel_layer.group_send(
            group=f"{apt_id}",
            message={
                'type': 'update.coords',
                'data': data.get('coords')
            }
        )

    # functions called by send json
    async def apt_booked_msg(self, message):
        await self.send_json(
            {
                'type': 'apt.booked.msg',
                'data': message.get('data')
            }
        )

    async def apt_requested_clins(self, message):
        await self.send_json(
            {
                'type': 'apt.requested.clins',
                'data': message.get('data')
            }
        )

    async def clin_arrival_update(self, message):

        await self.send_json(
            {
                'type': 'clin.arrival.update',
                'data': message.get('data')
            }
        )

    async def clin_on_way(self, message):

        await self.send_json(
            {
                'type': 'clin.on.way',
                'data': message.get('data')
            }
        )

    async def chat_message_created(self, message):

        await self.send_json(
            {
                'type': 'chat.message.created',
                'data': message.get('data')
            }
        )

    async def clin_complete_update(self, message):

        await self.send_json(
            {
                'type': 'clin.complete.update',
                'data': message.get('data')
            }
        )

    async def echo_message(self, message):
        await self.send_json(message)

    async def patient_canceled(self, message):

        await self.send_json(
            {
                'type': 'patient.canceled',
                'data': message.get('data')
            }
        )

    async def update_coords(self, message):
        await self.send_json(
            {
                'type': 'update.coords',
                'data': message.get('data')
            }
        )

    # main logic for processing 
    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        # get function from mapper
        await self._message_type_mapper(message_type, content)

    def _message_type_mapper(self, message_type, content):
        # helper for processing
        mapper = {
            'schedule.appointment': self.schedule_appointment,
            'create.apt': self.create_apt,
            'clin.book.apt': self.clin_book_apt,
            'update.appointment': self.update_appointment,
            'echo.message': self.echo_message,
            'create.new_chat_msg': self.create_new_chat_msg,
            'update.coords': self.update_apt_coords,
            'clin.begin.nav': self.clin_begin_nav,
            'clin.arrived': self.clin_arrived,
            'clin.apt.complete': self.clin_complete,
            'patient.apt.cancel': self.cancel_apt
        }

        return mapper[message_type](content)
