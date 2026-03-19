import aios from 'axios';
const axiosClient = aios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu API trả về lỗi 401 (Unauthorized) và chưa từng thử refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Lấy refresh token dự phòng
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token");

        // Gọi API xin cấp lại Access Token mới
        const res = await axios.post('http://localhost:8000/api/v1/auth/refresh/', {
          refresh: refreshToken,
        });

        // Lưu Access Token mới vào LocalStorage
        localStorage.setItem('access_token', res.data.access);

        // Gắn token mới vào request bị lỗi ban nãy và gửi lại
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn -> Xóa hết và bắt đăng nhập lại
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;