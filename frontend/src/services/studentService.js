// frontend/src/services/studentService.js
import axiosClient from './axiosClient';

const studentService = {
  getStudents: async () => {
    const response = await axiosClient.get('/students/');
    return response.data.results || response.data;
  },
  getTuitionPackages: async () => {
    const response = await axiosClient.get('/tuition-packages/');
    return response.data.results || response.data;
  },

  recordPayment: async (paymentData) => {
    // Tùy theo API Backend, đây là endpoint giả định cho việc thu tiền
    const response = await axiosClient.post('/payments/', paymentData);
    return response.data;
  }
};

export default studentService;