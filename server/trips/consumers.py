from distutils.util import change_root
from email import message
from itertools import chain
from aioredis import Channel
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class TripConsumer(AsyncJsonWebsocketConsumer):
    groups = ['test']

    async def connect(self):
        await self.channel_layer.group_add(
            group='test',
            channel=self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            group='test',
            channel=self.channel_name
        )
        return await super().disconnect(code)
    
    async def echo_message(self, message):
        # periods in message type mapped to _
        await self.send_json({
            'type': message.get('type'),
            'data': message.get('data'),
        })

    async def receive_json(self, content, **kwargs):
        print('called the receive json function')
        message_type = content.get('type')
        if message_type == 'echo.message':
            await self.send_json({
                'type': message_type,
                'data': content.get('data')
            })

