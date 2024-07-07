from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone
import uuid
import random
import json

# Create your models here.

from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='category_photos/', null=True, blank=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    description = models.TextField()
    discount = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)
    photo = models.ImageField(upload_to='product_photos/', null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)
    view = models.IntegerField(default=0)
    new_price = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('У пользователя должны иметь адрес электронной почты')
        if not name:
            raise ValueError('У пользователя должны иметь имя')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email,
            password=password,
            name=name,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50, null=True)
    birthday = models.DateField(null=True)
    phone = models.CharField(max_length=20, null=True)
    new_password = models.CharField(max_length=128, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    basket_supplier = models.CharField(max_length=100, null=True, blank=True)
    basket_items = models.JSONField(null=True, blank=True)


    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups",
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_user_permissions",
        related_query_name="customuser",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def get_full_name(self):
        return self.name

    def __str__(self):
        return self.email


def generate_unique_code():
    code = str(random.randint(10000000, 99999999)) + '-' + str(random.randint(1000, 9999))
    return code

class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=100, decimal_places=2)
    status = models.CharField(max_length=20)
    date = models.DateTimeField(default=timezone.now)
    products = models.JSONField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments', null=True)

    def __str__(self):
        return str(self.id)

