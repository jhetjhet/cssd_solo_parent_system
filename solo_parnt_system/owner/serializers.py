from rest_framework import serializers
from .models import User

class UserSerializer (serializers.ModelSerializer):

    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'is_admin',
        )
        extra_kwargs = {'password': {'write_only': True}}

    def get_is_admin(self, obj):
        return obj.is_superuser