from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Branch, Course, Band, ClassGroup, Student, TuitionPackage, Enrollment, GradeRecord, Task, PaymentReceipt, StudentTuition

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (('Thông tin phân quyền', {'fields': ('role',)}),)

    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Branch)
admin.site.register(Course)
admin.site.register(Band)
admin.site.register(ClassGroup)
admin.site.register(Student)
admin.site.register(TuitionPackage)
admin.site.register(Enrollment)
admin.site.register(GradeRecord)
admin.site.register(Task)
admin.site.register(PaymentReceipt)
admin.site.register(StudentTuition)
