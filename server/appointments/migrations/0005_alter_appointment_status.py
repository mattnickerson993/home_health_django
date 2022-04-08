# Generated by Django 4.0 on 2022-04-08 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0004_appointment_patient_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('ARRIVED', 'arrived'), ('COMPLETE', 'complete'), ('CANCELED', 'canceled'), ('IN_ROUTE', 'in_route'), ('REQUESTED', 'requested'), ('RESCHEDULED', 'rescheduled'), ('SCHEDULED', 'scheduled')], default='REQUESTED', max_length=40),
        ),
    ]