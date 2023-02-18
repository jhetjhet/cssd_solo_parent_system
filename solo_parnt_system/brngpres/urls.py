from rest_framework import routers
from .views import BrngPresViewSet

router = routers.SimpleRouter()
router.register(r'brngpres', BrngPresViewSet)
urlpatterns = router.urls