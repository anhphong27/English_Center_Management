from rest_framework import serializers
from .models import Branch, Course, Band, ClassGroup, Student, TuitionPackage, StudentTuition, PaymentReceipt, Enrollment, Task, GradeRecord

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
    
class CourseSerializer(serializers.ModelSerializer):
    brach_name = serializers.ReadOnlyField(source='branch.name')

    class Meta:
        model = Course
        fields = ['id', 'name', 'start_date', 'branch', 'brach_name']

class BandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Band
        fields = '__all__'

class ClassGroupSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    band_name = serializers.ReadOnlyField(source='band.name')
    teacher_names = serializers.StringRelatedField(many=True, source='teachers')

    class Meta:
        model = ClassGroup
        fields = ['id', 'name', 'status', 'course', 'course_name', 'band', 'band_name', 'teachers', 'teacher_names']

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

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    class_name = serializers.ReadOnlyField(source='class_group.name')
    
    class Meta:
        model = Enrollment
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