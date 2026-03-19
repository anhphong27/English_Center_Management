// frontend/src/services/academicService.js
import axiosClient from './axiosClient';

const academicService = {
  getCourses: async () => {
    const response = await axiosClient.get('/courses/');
    return response.data.results || response.data;
  },
  getClassesByCourse: async (courseId) => {
    const response = await axiosClient.get('/classes/', { params: { course_id: courseId } });
    return response.data.results || response.data;
  },
  createClass: async (classData) => {
    const response = await axiosClient.post('/classes/', classData);
    return response.data;
  },

  getBands: async () => {
    const response = await axiosClient.get('/bands/');
    return response.data.results || response.data;
  }
};

export default academicService;