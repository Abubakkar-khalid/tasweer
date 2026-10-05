from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_coming_soon = models.BooleanField(default=False)
    is_customizable = models.BooleanField(default=False)
    tag = models.CharField(max_length=50, blank=True, null=True) # e.g., SALE, NEW
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Global stock fallback for products without variations (like mugs)
    in_stock = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=100, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"

class ProductVariation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variations')
    name = models.CharField(max_length=50) # e.g., "Small", "White", "Large"
    in_stock = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} - {self.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('New', 'New'),
        ('Processing', 'Processing'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    
    order_id = models.CharField(max_length=20, unique=True, blank=True) # e.g. ORD-10045
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField(max_length=150)
    customer_phone = models.CharField(max_length=50)
    shipping_address = models.TextField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_id:
            super().save(*args, **kwargs)
            self.order_id = f"ORD-{10000 + self.id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    variation = models.CharField(max_length=100, blank=True, null=True) # e.g., Size M
    
    def __str__(self):
        return f"{self.quantity}x {self.product_name} in Order {self.order.order_id}"
