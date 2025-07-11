import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Direct backend URL, no proxy
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
   
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('- No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
 

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('http://localhost:4000/api/auth/refresh-token', {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;

          return api(originalRequest);
        } else {
          console.warn(' No refresh token found');
        }
      } catch (refreshError) {
        console.error(' Token refresh failed:', refreshError.response?.data?.message || refreshError.message);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 