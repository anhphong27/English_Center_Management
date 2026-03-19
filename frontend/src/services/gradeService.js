// frontend/src/services/gradeService.js
import axiosClient from './axiosClient';

const gradeService = {
  // Lấy danh sách các lớp học đang mở
  getClasses: async () => {
    const response = await axiosClient.get('/classes/');
    return response.data.results || response.data;
  },

  // Lấy sổ điểm của 1 lớp cụ thể
  getGradesByClass: async (classId) => {
    const response = await axiosClient.get('/grades/', { params: { class_id: classId } });
    return response.data.results || response.data;
  },

  // Lưu nháp bảng điểm (Cập nhật nhiều học sinh cùng lúc)
  saveDraft: async (gradesData) => {
    // Dùng Promise.all để gửi nhiều request PATCH cập nhật điểm cho từng học sinh
    const promises = gradesData.map((grade) => 
      axiosClient.patch(`/grades/${grade.id}/`, grade)
    );
    await Promise.all(promises);
    return true;
  },

  // Chốt điểm gửi Giáo vụ
  submitGrades: async (classId) => {
    const response = await axiosClient.post('/grades/submit-grades/', { class_id: classId });
    return response.data;
  }
};

export default gradeService;