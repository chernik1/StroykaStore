from django.contrib import admin
from .models import Brands, Categories

# Register your models here.

@admin.register(Brands)
class BrandsAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('category', 'subcategories', 'companies', 'img')