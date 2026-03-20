from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import m2m_changed # Dùng m2m_changed thay vì post_save
from django.dispatch import receiver

# ==========================================
# 1. QUẢN LÝ TÀI KHOẢN VÀ PHÂN QUYỀN
# ==========================================
class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'System Admin'),
        ('MANAGER', 'Quản lý'),
        ('STAFF', 'Giáo vụ'),
        ('TEACHER', 'Giáo viên'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STAFF', verbose_name="Vai trò")
    phone_number = models.CharField(max_length=20, blank=True, null=True, unique=True, verbose_name="Số điện thoại")

    class Meta:
        verbose_name = "Tài khoản"
        verbose_name_plural = "1. Quản lý Tài khoản"

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    def save(self, *args, **kwargs):
        # Hệ thống tự động khóa cổng /admin đối với STAFF và TEACHER
        if self.role == 'ADMIN':
            self.is_staff = True
            self.is_superuser = True
        elif self.role == 'MANAGER':
            self.is_staff = True
            self.is_superuser = True
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

# ==========================================
# 2. CẤU TRÚC ĐÀO TẠO
# ==========================================
class Branch(models.Model):
    name = models.CharField(max_length=255, verbose_name="Tên cơ sở")
    address = models.TextField(verbose_name="Địa chỉ")
    class Meta:
        verbose_name = "Cơ sở"
        verbose_name_plural = "2.1 Cơ sở đào tạo"
    def __str__(self): return f"{self.name} - {self.address}"

class Course(models.Model):
    name = models.CharField(max_length=255, verbose_name="Tên khóa học")
    start_date = models.DateField(verbose_name="Ngày khai giảng dự kiến")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='courses', verbose_name="Thuộc Cơ sở")
    class Meta:
        verbose_name = "Khóa học"
        verbose_name_plural = "2.2 Khóa học"
    def __str__(self): return f"{self.name} ({self.branch.name})"

class Band(models.Model):
    name = models.CharField(max_length=255, verbose_name="Tên Band điểm")
    order_index = models.IntegerField(verbose_name="Thứ tự lộ trình")
    class Meta:
        verbose_name = "Band điểm"
        verbose_name_plural = "2.3 Band điểm"
    def __str__(self): return self.name

class ClassGroup(models.Model):
    STATUS_CHOICES = [('ACTIVE', 'Đang mở'), ('INACTIVE', 'Đóng')]

    name = models.CharField(max_length=255, verbose_name="Mã Lớp học")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE', verbose_name="Trạng thái")

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='class_groups', verbose_name="Thuộc Khóa")
    band = models.ForeignKey(Band, on_delete=models.PROTECT, related_name='class_groups', verbose_name="Thuộc Band")
    teachers = models.ManyToManyField(User, related_name='class_groups', limit_choices_to={'role': 'TEACHER'}, verbose_name="Giáo viên phụ trách")
    
    # [CẬP NHẬT QUAN TRỌNG]: Đưa Học viên thẳng vào Lớp học qua ManyToMany
    students = models.ManyToManyField('Student', related_name='enrolled_classes', blank=True, verbose_name="Học viên của lớp")

    class Meta:
        verbose_name = "Lớp học & Xếp lớp"
        verbose_name_plural = "2.4 Lớp học & Xếp lớp"
    def __str__(self): return f"{self.name} - {self.band.name}"

# ==========================================
# 3. HỌC VIÊN & HỌC PHÍ
# ==========================================
class Student(models.Model):
    STATUS_CHOICES = [('ACTIVE', 'Đang học'), ('INACTIVE', 'Đã nghỉ')]
    full_name = models.CharField(max_length=255, verbose_name="Họ và tên")
    phone = models.CharField(max_length=20, unique=True, verbose_name="Số điện thoại")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE', verbose_name="Trạng thái")
    parent_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Tên Phụ huynh")
    parent_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="SĐT Phụ huynh")

    class Meta:
        verbose_name = "Học viên"
        verbose_name_plural = "3.1 Danh sách Học viên"
    def __str__(self): return f"{self.full_name} (HV-{self.id})"
    
class TuitionPackage(models.Model):
    PACKAGE_TYPES = [('SINGLE', 'Lẻ từng Band'), ('ROADMAP', 'Lộ trình nhiều Band')]
    name = models.CharField(max_length=255, verbose_name="Tên Gói học phí")
    total_price = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Tổng tiền (VNĐ)")
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES, verbose_name="Loại gói")
    bands_included = models.ManyToManyField(Band, related_name='tuition_packages', verbose_name="Bao gồm các Band")
    class Meta:
        verbose_name = "Gói Học phí"
        verbose_name_plural = "3.2 Gói Học phí"
    def __str__(self): return self.name

class StudentTuition(models.Model):
    total_amount = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Tổng tiền phải đóng")
    installments_planned = models.IntegerField(default=1, verbose_name="Số đợt chia đóng")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày đăng ký")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='tuitions', verbose_name="Học viên")
    package = models.ForeignKey(TuitionPackage, on_delete=models.PROTECT, related_name='student_tuitions', verbose_name="Gói đã mua")
    class Meta:
        verbose_name = "Hồ sơ Học phí"
        verbose_name_plural = "3.3 Hồ sơ Học phí (Đăng ký gói)"
    def __str__(self): return f"{self.student.full_name} - {self.package.name}"

class PaymentReceipt(models.Model):
    amount_paid = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Số tiền đã thu")
    paid_date = models.DateTimeField(auto_now_add=True, verbose_name="Ngày thu")
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recorded_payments', verbose_name="Người thu")
    student_tuition = models.ForeignKey(StudentTuition, on_delete=models.CASCADE, related_name='payments', verbose_name="Thuộc Hồ sơ học phí")
    class Meta:
        verbose_name = "Phiếu thu"
        verbose_name_plural = "3.4 Lịch sử Phiếu thu"

# (Đã Xóa class Enrollment vì tích hợp vào ClassGroup)

# ==========================================
# 4. WORKFLOW TASK & ĐÁNH GIÁ 4 KỸ NĂNG
# ==========================================
class Task(models.Model):
    TASK_TYPES = [
        ('CHUYEN_LOP', 'Chuyển lớp'), ('XIN_NGUNG_HOC', 'Xin ngừng học'),
        ('XIN_PHAN_HOI', 'Xin phản hồi về học viên'), ('BAO_LUU','Bảo lưu'),
        ('XIN_HOC_LAI', 'Xin học lại'), ('KHAC', 'Khác'),
    ]
    STATUS_CHOICES = [
        ('CHO_GIAO_VIEN_DUYET', 'Đang chờ giáo viên duyệt'), ('CHO_QUAN_LY_DUYET', 'Đang chờ quản lý duyệt'),
        ('CAN_THEM_THONG_TIN', 'Cần thêm thông tin'), ('GIAO_VIEN_DUYET', 'Giáo viên đã duyệt'),
        ('QUAN_LY_DUYET', 'Quản lý đã duyệt'), ('HOAN_TAT', 'Hoàn tất'), ('TU_CHOI', 'Từ chối'),
    ]
    task_type = models.CharField(max_length=50, choices=TASK_TYPES, verbose_name="Loại công việc") 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CHO_GIAO_VIEN_DUYET', verbose_name="Trạng thái")
    teacher_rejection_reason = models.TextField(null=True, blank=True, verbose_name="Lý do GV từ chối")
    manager_rejection_reason = models.TextField(null=True, blank=True, verbose_name="Lý do QL từ chối")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Cập nhật lần cuối")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tasks', verbose_name="Người tạo")
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks', verbose_name="Người xử lý hiện tại")
    class Meta:
        verbose_name = "Task (Công việc)"
        verbose_name_plural = "4.1 Quản lý Task"

class GradeRecord(models.Model):
    listening_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Điểm Nghe")
    listening_fb = models.TextField(null=True, blank=True, verbose_name="Nhận xét Nghe")
    speaking_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Điểm Nói")
    speaking_fb = models.TextField(null=True, blank=True, verbose_name="Nhận xét Nói")
    reading_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Điểm Đọc")
    reading_fb = models.TextField(null=True, blank=True, verbose_name="Nhận xét Đọc")
    writing_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Điểm Viết")
    writing_fb = models.TextField(null=True, blank=True, verbose_name="Nhận xét Viết")
    is_finalized = models.BooleanField(default=False, verbose_name="Đã chốt điểm gửi Giáo vụ")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades', verbose_name="Học viên")
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='grades', verbose_name="Lớp học")
    
    class Meta:
        unique_together = ('student', 'class_group')
        verbose_name = "Bảng điểm 4 Kỹ năng"
        verbose_name_plural = "4.2 Bảng điểm 4 Kỹ năng"

# [CẬP NHẬT TỰ ĐỘNG TẠO SỔ ĐIỂM]
@receiver(m2m_changed, sender=ClassGroup.students.through)
def create_grade_records_for_students(sender, instance, action, pk_set, **kwargs):
    """
    Khi Quản lý 'add' nhiều học sinh vào Lớp (action = post_add), 
    hệ thống tự động quét và tạo sổ điểm trống cho từng bạn.
    """
    if action == "post_add":
        for student_id in pk_set:
            GradeRecord.objects.get_or_create(
                student_id=student_id,
                class_group=instance
            )