from rest_framework import viewsets
from .models import (
    Announcement,
)
from .serializers import (
    AnnouncementSerializer,
)

class AnnouncementViewSet (viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()