import instance from './axios';

// Attach a request interceptor to add Authorization header with token from localStorage
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = 'Token ' + token;
      }
    } catch (storageError) {
      // If localStorage is not available, just continue without token
      console.error('Token read error:', storageError);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
