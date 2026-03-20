# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    BranchViewSet, CourseViewSet, BandViewSet, ClassGroupViewSet,
    StudentViewSet, TuitionPackageViewSet, StudentTuitionViewSet, 
    PaymentReceiptViewSet, TaskViewSet, GradeRecordViewSet
)

router = DefaultRouter()
router.register(r'branches', BranchViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'bands', BandViewSet)
router.register(r'classes', ClassGroupViewSet)
router.register(r'students', StudentViewSet)
router.register(r'tuition-packages', TuitionPackageViewSet)
router.register(r'student-tuitions', StudentTuitionViewSet)
router.register(r'payments', PaymentReceiptViewSet) 
router.register(r'tasks', TaskViewSet)
router.register(r'grades', GradeRecordViewSet)
# (Đã gỡ bỏ router.register(r'enrollments', ...))

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]