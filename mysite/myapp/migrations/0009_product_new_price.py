# Generated by Django 5.0.2 on 2024-03-10 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0008_remove_customuser_basket_history_payment_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='new_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
