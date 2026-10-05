from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class OrderPermission(permissions.BasePermission):
    """
    Anyone can POST an order, but only admins can view/edit/delete orders.
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(request.user and request.user.is_staff)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.prefetch_related('images', 'variations').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('items').all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [OrderPermission]

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')
    if not username or not new_password:
        return Response({"error": "Username and new password required."}, status=400)
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({"success": "Password successfully reset!"})
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
