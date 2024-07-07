import random
from faker import Faker

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response

from .permissions import IsAdminOrAuthenticatedReadOnly
from .models import *
from .serializers import *

class ProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated, )

class CreateRandomProductsAPI(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAdminUser,)

    def create(self, request, *args, **kwargs):
        products_created = []
        faker = Faker()
        if request.method == 'POST':
            try:
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
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Request method is not post'}, status=status.HTTP_400_BAD_REQUEST)

class CreateProductAPI(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAdminUser,)

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
            try:
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
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Request method is not post'}, status=status.HTTP_400_BAD_REQUEST)

class CategoryAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated, )

class CreateCategoryAPI(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAdminUser,)

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            name = request.POST['name']
            photo = request.FILES.get('photo')

            try:
                category = Category.objects.create(
                    name=name,
                    photo=photo,
                )
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Request method is not post'}, status=status.HTTP_400_BAD_REQUEST)

class SubcategoryAPIView(generics.ListAPIView):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    permission_classes = (IsAuthenticated, )

class CreateSubcategoryAPI(generics.CreateAPIView):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    permission_classes = (IsAdminUser,)

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            name = request.POST['name']
            category_id = request.POST['category']

            try:
                subcategory = Subcategory.objects.create(
                    name=name,
                    category=Category.objects.get(id=category_id),
                )
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(subcategory)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Request method is not post'}, status.HTTP_400_BAD_REQUEST)

class SupplierListCreateAPIView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = (IsAdminOrAuthenticatedReadOnly, )

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            try:
                name = request.data['name']
                supplier = Supplier.objects.create(
                    name=name
                )
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(supplier)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Request method is not post'}, status=status.HTTP_400_BAD_REQUEST)

class BrandListCreateAPIView(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (IsAdminOrAuthenticatedReadOnly, )

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            try:
                name = request.data['name']
                brand = Brand.objects.create(
                    name=name
                )
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(brand)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Request method is not post'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentAPIView(generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = (IsAdminUser, )