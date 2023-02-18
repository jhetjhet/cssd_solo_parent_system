from rest_framework import serializers
from .models import (
    BrngPres,
)

class BrngPresSerializer (serializers.ModelSerializer):

    class Meta:
        model = BrngPres
        fields = '__all__'