# English Center Management System (ECMS)

## 📖 Giới thiệu dự án (About The Project)
English Center Management System (ECMS) là một hệ thống ứng dụng Web (Web Application) được thiết kế chuyên biệt để quản lý toàn diện các nghiệp vụ của Trung tâm Tiếng Anh (Đặc biệt là các khóa luyện thi TOEIC/IELTS). Hệ thống giúp số hóa toàn bộ quy trình từ quản lý học viên, thu học phí, điểm danh, cho đến hệ thống Workflow xử lý các yêu cầu chuyên môn (chuyển lớp, bảo lưu, nhập điểm 4 kỹ năng).

Mục tiêu cốt lõi: Giảm thiểu sai sót thủ công, tăng cường hiệu suất làm việc của Giáo vụ/Giáo viên và cung cấp dữ liệu trực quan (BI Dashboard) cho Quản lý.

## ✨ Tính năng nổi bật (Key Features)
* **Quản lý Cấu trúc Đào tạo:** Quản lý Cơ sở, Lộ trình học, Band điểm và Lớp học.
* **Hệ thống Học phí Thông minh:** Hỗ trợ tính toán các gói đóng theo lộ trình dài hạn hoặc đóng lẻ từng band, theo dõi công nợ chi tiết.
* **Quản lý Lớp học & Điểm danh:** Lịch dạy cho giáo viên, điểm danh học viên hàng ngày.
* **Workflow Task Management (Cốt lõi):** * Xử lý các luồng duyệt nghiệp vụ (Giáo vụ -> Giáo viên -> Quản lý).
  * Task chuyên biệt: "Nhắc chấm điểm" hỗ trợ đánh giá chi tiết 4 kỹ năng (Nghe, Nói, Đọc, Viết) theo chuẩn IELTS/TOEIC.
* **BI Dashboard:** Báo cáo doanh thu, tỷ lệ chuyên cần và hiệu suất xử lý Task trực quan.

## 🛠 Công nghệ sử dụng (Tech Stack)
* **Frontend:** ReactJS, Material-UI (MUI), Redux Toolkit, React Query.
* **Backend:** Python, Django REST Framework (DRF).
* **Database:** PostgreSQL.
* **DevOps/Deployment:** Docker, GitHub Actions (CI/CD).

---

## 🚀 Hướng dẫn Cài đặt (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
* Node.js (v18+)
* Python (v3.10+)
* PostgreSQL (v14+)
* Git

### 2. Cài đặt Backend (Django)
```bash
# Clone repository
git clone [https://github.com/your-org/ecms.git](https://github.com/your-org/ecms.git)
cd ecms/backend

# Tạo môi trường ảo (Virtual Environment)
python -m venv venv
source venv/bin/activate  # Trên Windows dùng: venv\Scripts\activate

# Cài đặt thư viện
pip install -r requirements.txt

# Thiết lập biến môi trường (.env)
cp .env.example .env
# Chỉnh sửa file .env với cấu hình PostgreSQL của bạn

# Chạy Migrations và tạo Superuser
python manage.py migrate
python manage.py createsuperuser

# Khởi chạy Server
python manage.py runserver
