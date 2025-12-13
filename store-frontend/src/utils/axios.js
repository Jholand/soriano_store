import axios from 'axios';

// Base URL will be relative since we're using Vite's proxy
axios.defaults.baseURL = '';

// Add CSRF token to all requests
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add response interceptor for handling errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      // Handle unauthenticated user
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;