from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Branch, Course, Band, ClassGroup, Student, TuitionPackage, Enrollment, GradeRecord, Task, PaymentReceipt, StudentTuition
from .serializers import BranchSerializer, CourseSerializer, BandSerializer, ClassGroupSerializer, StudentSerializer, TuitionPackageSerializer, StudentTuitionSerializer, PaymentReceiptSerializer, EnrollmentSerializer, TaskSerializer, GradeRecordSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsAdmin, IsManagerOrAdmin, IsStaffOrManagerOrAdmin, IsTeacher

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAdmin]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsManagerOrAdmin]

class BandViewSet(viewsets.ModelViewSet):
    queryset = Band.objects.all()
    serializer_class = BandSerializer


class ClassGroupViewSet(viewsets.ModelViewSet):
    queryset = ClassGroup.objects.all()
    serializer_class = ClassGroupSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset
    
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsStaffOrManagerOrAdmin]

class TuitionPackageViewSet(viewsets.ModelViewSet):
    queryset = TuitionPackage.objects.all()
    serializer_class = TuitionPackageSerializer

class StudentTuitionViewSet(viewsets.ModelViewSet):
    queryset = StudentTuition.objects.all()
    serializer_class = StudentTuitionSerializer

class PaymentReceiptViewSet(viewsets.ModelViewSet):
    queryset = PaymentReceipt.objects.all()
    serializer_class = PaymentReceiptSerializer
    permission_classes = [IsStaffOrManagerOrAdmin]

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    # Tính năng Lọc Task theo trạng thái (Pending, Done...)
    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class GradeRecordViewSet(viewsets.ModelViewSet):
    queryset = GradeRecord.objects.all()
    serializer_class = GradeRecordSerializer

    # Lấy sổ điểm của 1 lớp cụ thể
    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(class_group_id=class_id)
        return queryset

    # API Custom: Nút "Chốt điểm & Gửi Giáo vụ"
    @action(detail=False, methods=['post'], url_path='submit-grades', permission_classes=[IsTeacher])
    def submit_grades(self, request):
        class_id = request.data.get('class_id')
        if not class_id:
            return Response({'error': 'Thiếu class_id'}, status=400)
        
        # Cập nhật toàn bộ học sinh trong lớp thành "Đã chốt điểm"
        GradeRecord.objects.filter(class_group_id=class_id).update(is_finalized=True)
        
        # (Sau này ta sẽ thêm code bắn Notification cho Giáo vụ ở đây)
        return Response({'status': 'Thành công', 'message': 'Đã chốt sổ điểm và gửi Giáo vụ!'})


