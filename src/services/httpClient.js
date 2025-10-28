import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
});

export const setAuthToken = (token) => {
  if (token) {
    httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common.Authorization;
  }
};

export default httpClient;
