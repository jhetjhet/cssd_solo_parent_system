from rest_framework import routers
from .views import (
    AnnouncementViewSet
)

router = routers.SimpleRouter()
router.register(r'announcements', AnnouncementViewSet)
urlpatterns = router.urls