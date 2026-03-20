# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    User, Branch, Course, Band, ClassGroup,
    Student, TuitionPackage, StudentTuition, PaymentReceipt,
    Task, GradeRecord
)

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField(source='branch.name')
    class Meta:
        model = Course
        fields = ['id', 'name', 'branch', 'branch_name', 'start_date']

class BandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Band
        fields = '__all__'

class ClassGroupSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    band_name = serializers.ReadOnlyField(source='band.name')
    
    class Meta:
        model = ClassGroup
        # Đã bổ sung 'teachers' và 'students' (dạng danh sách ID)
        fields = ['id', 'name', 'course', 'course_name', 'band', 'band_name', 'status', 'teachers', 'students']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class TuitionPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuitionPackage
        fields = '__all__'

class StudentTuitionSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    package_name = serializers.ReadOnlyField(source='package.name')
    class Meta:
        model = StudentTuition
        fields = '__all__'

class PaymentReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentReceipt
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username')
    class Meta:
        model = Task
        fields = '__all__'

class GradeRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    class Meta:
        model = GradeRecord
        fields = '__all__'