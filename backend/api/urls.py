from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BranchViewSet, CourseViewSet, BandViewSet, ClassGroupViewSet, StudentViewSet, TuitionPackageViewSet, StudentTuitionViewSet, PaymentReceiptViewSet, EnrollmentViewSet, TaskViewSet, GradeRecordViewSet

router = DefaultRouter()
router.register(r'branches', BranchViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'bands', BandViewSet)
router.register(r'classes', ClassGroupViewSet)
router.register(r'students', StudentViewSet)
router.register(r'tuition-packages', TuitionPackageViewSet)
router.register(r'student-tuitions', StudentTuitionViewSet)
router.register(r'payment-receipts', PaymentReceiptViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'grade-records', GradeRecordViewSet)


urlpatterns = [
    path('', include(router.urls)),
]