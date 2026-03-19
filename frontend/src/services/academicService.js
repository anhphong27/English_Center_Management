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
  
  
};

export default academicService;