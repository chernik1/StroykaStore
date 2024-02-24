from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.

class Brands(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Categories(models.Model):
    category = models.CharField(max_length=100)
    subcategories = models.JSONField()
    companies = models.JSONField()

    def __str__(self):
        return self.category