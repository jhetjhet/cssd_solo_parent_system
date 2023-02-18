from rest_framework import routers
from .views import ParentViewset

router = routers.SimpleRouter()
router.register(r'parents', ParentViewset)
urlpatterns = router.urls