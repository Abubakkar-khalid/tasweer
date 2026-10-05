from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariation, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']

class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = ['id', 'name', 'in_stock']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(write_only=True, required=False)
    images = ProductImageSerializer(many=True, read_only=True)
    variations = ProductVariationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'slug', 'name', 'description', 'price', 'original_price', 
            'is_coming_soon', 'is_customizable', 'tag', 'in_stock', 'category', 'category_name', 
            'images', 'variations', 'created_at', 'updated_at'
        ]

    def _get_category(self, request):
        cat_name = request.data.get('category_name')
        if cat_name:
            from .models import Category
            slug = cat_name.lower().replace(' ', '-')
            import re
            slug = re.sub(r'[^a-z0-9]+', '-', slug)
            cat, _ = Category.objects.get_or_create(name=cat_name, defaults={'slug': slug})
            return cat
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        cat = self._get_category(request)
        validated_data.pop('category_name', None)
        
        if cat:
            validated_data['category'] = cat
            
        product = Product.objects.create(**validated_data)
        
        self._handle_nested_data(product, request)
        return product
        
    def update(self, instance, validated_data):
        request = self.context.get('request')
        cat = self._get_category(request)
        validated_data.pop('category_name', None)
        
        if cat:
            instance.category = cat
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # If files are uploaded, delete old and add new (simplest approach for now)
        if request and request.FILES:
            instance.images.all().delete()
            
        self._handle_nested_data(instance, request)
        return instance
        
    def _handle_nested_data(self, product, request):
        if not request: return
        
        # Images
        if request.FILES:
            for key, file in request.FILES.items():
                if key.startswith('image'):
                    ProductImage.objects.create(product=product, image=file)
                    
        # Variations
        variations_data = request.data.get('variations')
        if variations_data:
            import json
            try:
                variations = json.loads(variations_data)
                # clear old variations on update if we provided new ones
                product.variations.all().delete()
                for v in variations:
                    ProductVariation.objects.create(product=product, name=v.get('name'), in_stock=v.get('inStock', True))
            except Exception as e:
                print("Error parsing variations:", e)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity', 'variation']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'customer_email', 'customer_phone',
            'shipping_address', 'total_amount', 'status', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['order_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
