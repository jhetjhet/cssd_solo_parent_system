from rest_framework import viewsets
from .models import (
    BrngPres,

)
from .serializers import (
    BrngPresSerializer,
)

class BrngPresViewSet (viewsets.ModelViewSet):
    serializer_class = BrngPresSerializer
    queryset = BrngPres.objects.all()
    