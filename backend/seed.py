import os
import sys
import django

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Product, ProductImage, ProductVariation

def seed_db():
    print("Clearing existing data...")
    Category.objects.all().delete()
    
    print("Seeding categories...")
    categories_names = ['Bestsellers', 'Customize Items', 'Apparel', 'Wall Frames', 'Gifts']
    cats = {}
    for name in categories_names:
        slug = name.lower().replace(' ', '-')
        cats[name] = Category.objects.create(name=name, slug=slug)
        
    print("Seeding products...")
    for i in range(12):
        cat_name = ['Customize Items', 'Bestsellers', 'Apparel', 'Wall Frames'][i % 4]
        category = cats[cat_name]
        
        is_shirt = cat_name == 'Customize Items' and i % 2 == 0
        is_mug = cat_name == 'Customize Items' and i % 2 != 0
        is_sale = i == 1 or i == 5
        is_out_of_stock = i == 3 or i == 7
        is_new = i == 2 or i == 6
        
        base_price = 850.00 if is_mug else (2500.00 if cat_name == 'Wall Frames' else 1500.00)
        
        price = base_price * 0.8 if is_sale else base_price
        original_price = base_price if is_sale else None
        
        slug = 'custom-printed-t-shirt' if is_shirt else ('personalized-magic-mug-with-photo' if is_mug else f'product-{i + 1}')
        # Make slug unique
        slug = f"{slug}-{i}"
        
        name = 'Custom Printed T-Shirt' if is_shirt else ('Personalized Magic Mug with Photo' if is_mug else ('Custom Wooden Wall Frame' if cat_name == 'Wall Frames' else 'Customized Name Necklace - 18k Gold Plated'))
        description = 'Design your own premium cotton t-shirt! Upload your favorite photo or artwork, and we will print it flawlessly on the front.' if is_shirt else 'A beautiful, high-quality product perfect for gifting.'
        
        tag = 'SALE' if is_sale else ('NEW' if is_new else None)
        
        p = Product.objects.create(
            category=category,
            name=name,
            slug=slug,
            description=description,
            price=price,
            original_price=original_price,
            tag=tag,
            in_stock=not is_out_of_stock
        )
        
        # Images
        images = ['/tshirt.jpg', '/product2.jpg'] if is_shirt else (['/mug.jpg', '/product1.jpg'] if is_mug else (['/product1.jpg', '/hero.jpg'] if i % 2 == 0 else ['/product2.jpg', '/hero.jpg']))
        
        for idx, img in enumerate(images):
            # In Django, ImageField usually wants a relative path inside MEDIA_ROOT, 
            # but since we don't have actual files, we can just save it as text, or we can use strings if we change the model.
            # But wait, ProductImage uses ImageField(upload_to='products/')
            # We can just set the string in the DB directly without a real file if we bypass some validation, or just use charfield for now.
            # Actually, `image` field will store the path. Let's just assign the string.
            ProductImage.objects.create(product=p, image=img.lstrip('/'), is_primary=(idx==0))

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
