import random
from faker import Faker

from rest_framework import generics, status
from rest_framework.response import Response

from .models import *
from .serializers import ProductSerializer
from mysite.settings import HOST

class ProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CreateRandomProductsAPI(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        products_created = []
        faker = Faker()
        for _ in range(10):
            brand = Brand.objects.all()[random.randint(0, Brand.objects.count() - 1)]
            supplier = Supplier.objects.all()[random.randint(0, Supplier.objects.count() - 1)]
            subcategory = Subcategory.objects.all()[random.randint(0, Subcategory.objects.count() - 1)]
            product = Product.objects.create(
                name=faker.word().title(),
                price=random.randint(100, 1000),
                description=faker.text(),
                discount=random.randint(0, 100),
                code=random.randint(100000, 99999999),
                photo='/static/img/api/api-img.png',
                brand= brand,
                supplier=supplier,
                subcategory=subcategory
            )
            products_created.append(product)

        serializer = self.get_serializer(products_created, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CreateProductAPI(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            code = request.POST['code']
            name = request.POST['name']
            price = request.POST['price']
            description = request.POST['description']
            discount = request.POST['discount']
            photo = request.FILES.get('photo')
            brand = Brand.objects.get(id=request.POST['brand'])
            supplier = Supplier.objects.get(id=request.POST['supplier'])
            subcategory = Subcategory.objects.get(id=request.POST['subcategory'])

            product = Product.objects.create(
                code=code,
                name=name,
                price=price,
                description=description,
                discount=discount,
                photo=photo,
                brand=brand,
                supplier=supplier,
                subcategory=subcategory
            )

            serializer = self.get_serializer(product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)