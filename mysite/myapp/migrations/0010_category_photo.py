# Generated by Django 5.0.2 on 2024-02-25 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_remove_product_brand_remove_product_supplier_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='category_photos/'),
        ),
    ]
