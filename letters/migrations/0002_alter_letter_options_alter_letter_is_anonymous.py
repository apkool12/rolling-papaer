# Generated by Django 5.1.4 on 2024-12-26 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('letters', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='letter',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterField(
            model_name='letter',
            name='is_anonymous',
            field=models.BooleanField(default=False),
        ),
    ]
