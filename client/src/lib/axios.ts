import axios from 'axios';

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    const err = new Error(message) as Error & { status?: number };
    err.status = error.response?.status;
    return Promise.reject(err);
  },
);

export default apiClient;
