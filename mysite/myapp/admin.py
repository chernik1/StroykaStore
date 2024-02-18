from django.contrib import admin
from .models import Brands

# Register your models here.

@admin.register(Brands)
class BrandsAdmin(admin.ModelAdmin):
    list_display = ('name',)