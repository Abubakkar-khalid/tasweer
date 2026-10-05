import os
import django

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product

def clear_db():
    print("Clearing all products...")
    Product.objects.all().delete()
    print("Products cleared successfully!")

if __name__ == "__main__":
    clear_db()
