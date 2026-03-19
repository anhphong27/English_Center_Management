from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BranchViewSet, CourseViewSet, BandViewSet, ClassGroupViewSet

router = DefaultRouter()
router.register(r'branches', BranchViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'bands', BandViewSet)
router.register(r'classes', ClassGroupViewSet)


urlpatterns = [
    path('', include(router.urls)),
]