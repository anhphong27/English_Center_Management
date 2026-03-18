from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

#1. Quản lí user và phân quyền
class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Superuser/System Admin'),
        ('MANAGER', 'Quản lý'),
        ('STAFF', 'Giáo vụ'),
        ('TEACHER', 'Giáo viên'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username}"

#2. Quản lí cấu trúc đào tạo: Chi nhánh -> Khóa học -> Lớp học(Band)
class Branch(models.Model):
    name = models.CharField(max_length=25)
    address = models.TextField()

    def __str__(self): 
        return self.name

class Course(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateField()

    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='courses')

    def __str__(self): 
        return f"{self.name} - {self.branch.name}"

class Band(models.Model):
    name = models.CharField(max_length=255)
    order_index = models.IntegerField()

    def __str__(self): 
        return self.name

class ClassGroup(models.Model):
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default='ACTIVE')

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='class_groups')
    band = models.ForeignKey(Band, on_delete=models.PROTECT, related_name='class_groups')
    teachers = models.ManyToManyField(User,related_name='class_groups')

    def __str__(self): 
        return f"{self.name} - {self.course.name} - {self.band.name}"
    
#3. Quản lí học sinh - học phí
class Student(models.Model):
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, default='ACTIVE')
    
class TuitionPackage(models.Model):
    PACKAGE_TYPES = [('SINGLE', 'Lẻ từng Band'), ('ROADMAP', 'Lộ trình nhiều Band')]

    name = models.CharField(max_length=255)
    total_price = models.DecimalField(max_digits=12, decimal_places=0)

    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES)
    bands_included = models.ManyToManyField(Band, related_name='tuition_packages')

class StudentTuition(models.Model):
    total_amount = models.DecimalField(max_digits=12, decimal_places=0)
    installments_planned = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='tuitions')
    package = models.ForeignKey(TuitionPackage, on_delete=models.PROTECT, related_name='student_tuitions')

class PaymentReceipt(models.Model):
    amount_paid = models.DecimalField(max_digits=12, decimal_places=0)
    paid_date = models.DateTimeField(auto_now_add=True)

    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recorded_payments')
    student_tuition = models.ForeignKey(StudentTuition, on_delete=models.CASCADE, related_name='payments')

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE)
    enroll_date = models.DateField(auto_now_add=True)

# 4. MODULE ĐÁNH GIÁ 4 KỸ NĂNG & WORKFLOW TASK
class Task(models.Model):
    task_type = models.CharField(max_length=50) # CHUYEN_LOP, CHAM_DIEM...
    status = models.CharField(max_length=20, default='PENDING') # PENDING, NEEDS_REVISION, DONE
    rejection_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks')
    

class GradeRecord(models.Model):
    listening_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    listening_fb = models.TextField(null=True, blank=True)
    speaking_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    speaking_fb = models.TextField(null=True, blank=True)
    reading_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    reading_fb = models.TextField(null=True, blank=True)
    writing_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    writing_fb = models.TextField(null=True, blank=True)

    is_finalized = models.BooleanField(default=False, verbose_name="Đã chốt điểm gửi Giáo vụ")

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='grades')
    
    class Meta:
        unique_together = ('student', 'class_group')

# TỰ ĐỘNG TẠO BẢNG ĐIỂM TRỐNG KHI HỌC VIÊN ĐƯỢC THÊM VÀO LỚP
@receiver(post_save, sender=Enrollment)
def create_grade_record_for_student(sender, instance, created, **kwargs):
    if created:
        GradeRecord.objects.create(
            student = instance.student,
            class_group = instance.class_group
        )

    
