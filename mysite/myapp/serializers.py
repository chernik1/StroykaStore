from rest_framework import serializers

from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta(serializers.ModelSerializer):
        model = Category
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta(serializers.ModelSerializer):
        model = Subcategory
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta(serializers.ModelSerializer):
        model = Supplier
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta(serializers.ModelSerializer):
        model = Brand
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta(serializers.ModelSerializer):
        model = Payment
        fields = '__all__'