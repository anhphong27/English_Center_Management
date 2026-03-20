from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Branch, Course, Band, ClassGroup, 
    Student, TuitionPackage, StudentTuition, PaymentReceipt, Task, GradeRecord
)

admin.site.site_header = 'Hệ Thống Quản Trị Trung Tâm ECMS'
admin.site.site_title = 'ECMS Admin'
admin.site.index_title = 'Bảng Điều Khiển Tổng'

# 1. Custom User Admin (Gom Thông tin cá nhân lên trên cùng)
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        ('1. THÔNG TIN CÁ NHÂN & LIÊN HỆ', {
            'fields': ('first_name', 'last_name', 'email', 'phone_number')
        }),
        ('2. THÔNG TIN ĐĂNG NHẬP', {
            'fields': ('username', 'password')
        }),
        ('3. PHÂN QUYỀN TRONG HỆ THỐNG', {
            'fields': ('role', 'is_active', 'is_staff'), #'is_staff', 'is_superuser'
            'description': 'Lưu ý: System Admin và Quản lý sẽ tự động được cấp quyền truy cập trang này.'
        }),
        ('4. NHÓM QUYỀN MỞ RỘNG (GROUPS)', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',), 
            'description': 'Phân quyền chi tiết theo bảng mặc định của Django (Bấm để mở rộng).'
        }),
        ('5. LỊCH SỬ', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',) # Thu gọn
        }),
    )
    list_display = ('username', 'full_name', 'role', 'phone_number', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('username', 'email', 'phone_number', 'first_name', 'last_name')
    ordering = ('username', '-date_joined')

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    full_name.short_description = "Họ Tên"

# 2. Khung Đào Tạo
@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    ordering = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch', 'start_date')
    list_filter = ('branch',)
    ordering = ('-start_date',)

@admin.register(Band)
class BandAdmin(admin.ModelAdmin):
    list_display = ('name', 'order_index')
    ordering = ('order_index',)

@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'band', 'status')
    list_filter = ('status', 'course', 'band')
    search_fields = ('name',)
    filter_horizontal = ('teachers', 'students') 
    ordering = ('course', 'band', 'name')

# 3. Học Viên & Học Phí
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'dob', 'phone', 'status', 'parent_name')
    list_filter = ('status',)
    search_fields = ('full_name', 'phone', 'parent_name')
    ordering = ('full_name', 'dob')

@admin.register(TuitionPackage)
class TuitionPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'package_type', 'total_price')
    list_filter = ('package_type',)
    filter_horizontal = ('bands_included',)

@admin.register(StudentTuition)
class StudentTuitionAdmin(admin.ModelAdmin):
    list_display = ('student', 'package', 'total_amount', 'installments_planned', 'created_at')
    search_fields = ('student__full_name',)

@admin.register(PaymentReceipt)
class PaymentReceiptAdmin(admin.ModelAdmin):
    list_display = ('student_tuition', 'amount_paid', 'paid_date', 'recorded_by')
    ordering = ('-paid_date',)

# 4. Task & Sổ Điểm
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_type', 'status', 'created_by', 'assigned_to', 'created_at')
    list_filter = ('status', 'task_type', 'created_at')
    ordering = ('-created_at',)

@admin.register(GradeRecord)
class GradeRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_group', 'is_finalized')
    list_filter = ('is_finalized', 'class_group__course', 'class_group')
    search_fields = ('student__full_name', 'class_group__name')
    ordering = ('class_group', 'student__full_name')