# Generated by Django 4.0 on 2022-03-23 10:56

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0002_add_photo'),
        ('appointments', '0004_appointment_patient_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='AptMessages',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('ACTIVE', 'active'), ('INACTIVE', 'inactive')], default='ACTIVE', max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='appointments.appointment')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='users.user')),
            ],
        ),
    ]