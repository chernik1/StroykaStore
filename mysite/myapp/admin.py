from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'discount', 'display_brands', 'display_suppliers', 'slug')

    def display_brands(self, obj):
        return ", ".join([brand.name for brand in obj.brand.all()])

    display_brands.short_description = 'Brands'

    def display_suppliers(self, obj):
        return ", ".join([supplier.name for supplier in obj.supplier.all()])

    display_suppliers.short_description = 'Suppliers'