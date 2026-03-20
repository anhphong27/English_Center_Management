from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Branch, Course, Band, ClassGroup,
    Student, TuitionPackage, StudentTuition, PaymentReceipt,
    Task, GradeRecord
)
from .serializers import (
    BranchSerializer, CourseSerializer, BandSerializer, ClassGroupSerializer,
    StudentSerializer, TuitionPackageSerializer, StudentTuitionSerializer, 
    PaymentReceiptSerializer, TaskSerializer, GradeRecordSerializer
)
from .permissions import IsAdmin, IsManagerOrAdmin, IsStaffOrManagerOrAdmin, IsTeacher

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsManagerOrAdmin]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsManagerOrAdmin]

class BandViewSet(viewsets.ModelViewSet):
    queryset = Band.objects.all().order_by('order_index')
    serializer_class = BandSerializer
    permission_classes = [IsManagerOrAdmin]

class ClassGroupViewSet(viewsets.ModelViewSet):
    queryset = ClassGroup.objects.all()
    serializer_class = ClassGroupSerializer
    permission_classes = [IsManagerOrAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    # [CUSTOM API]: Xếp nhiều học viên vào lớp cùng lúc
    # Gọi bằng: POST /api/v1/classes/{id}/enroll/
    @action(detail=True, methods=['post'], url_path='enroll', permission_classes=[IsStaffOrManagerOrAdmin])
    def enroll_students(self, request, pk=None):
        class_group = self.get_object() # Lấy lớp học hiện tại
        student_ids = request.data.get('student_ids', []) # Lấy mảng ID học sinh từ Frontend gửi lên

        if not isinstance(student_ids, list):
            return Response({'error': 'student_ids phải là một danh sách (mảng)'}, status=400)
        
        # Hàm add() của ManyToMany sẽ tự động thêm học sinh và tránh trùng lặp.
        # Đồng thời nó sẽ kích hoạt Signal m2m_changed để tạo Sổ điểm trống.
        class_group.students.add(*student_ids)
        
        return Response({
            'status': 'Thành công', 
            'message': f'Đã xếp thành công {len(student_ids)} học viên vào lớp {class_group.name}.'
        })

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsStaffOrManagerOrAdmin]

class TuitionPackageViewSet(viewsets.ModelViewSet):
    queryset = TuitionPackage.objects.all()
    serializer_class = TuitionPackageSerializer
    permission_classes = [IsManagerOrAdmin]

class StudentTuitionViewSet(viewsets.ModelViewSet):
    queryset = StudentTuition.objects.all()
    serializer_class = StudentTuitionSerializer
    permission_classes = [IsStaffOrManagerOrAdmin]

class PaymentReceiptViewSet(viewsets.ModelViewSet):
    queryset = PaymentReceipt.objects.all()
    serializer_class = PaymentReceiptSerializer
    permission_classes = [IsStaffOrManagerOrAdmin]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class GradeRecordViewSet(viewsets.ModelViewSet):
    queryset = GradeRecord.objects.all()
    serializer_class = GradeRecordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(class_group_id=class_id)
        return queryset

    @action(detail=False, methods=['post'], url_path='submit-grades', permission_classes=[IsTeacher])
    def submit_grades(self, request):
        class_id = request.data.get('class_id')
        if not class_id:
            return Response({'error': 'Thiếu class_id'}, status=400)
        GradeRecord.objects.filter(class_group_id=class_id).update(is_finalized=True)
        return Response({'status': 'Thành công', 'message': 'Đã chốt sổ điểm và gửi Giáo vụ!'})