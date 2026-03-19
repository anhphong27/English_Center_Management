// frontend/src/services/taskService.js
import axiosClient from './axiosClient';

const taskService = {
  // Hàm lấy danh sách Task, cho phép truyền tham số lọc (ví dụ: ?status=PENDING)
  getTasks: async (params) => {
    const response = await axiosClient.get('/tasks/', { params });
    return response.data;
  },

  // (Chuẩn bị sẵn) Hàm cập nhật trạng thái Task
  updateTaskStatus: async (taskId, statusData) => {
    const response = await axiosClient.patch(`/tasks/${taskId}/status/`, statusData);
    return response.data;
  }
};

export default taskService;