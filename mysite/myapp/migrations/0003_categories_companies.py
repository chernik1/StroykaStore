# Generated by Django 5.0.2 on 2024-02-24 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='categories',
            name='companies',
            field=models.JSONField(default=1),
            preserve_default=False,
        ),
    ]
