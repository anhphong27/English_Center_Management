from rest_framework import serializers
from .models import Branch, Course, Band, ClassGroup

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

