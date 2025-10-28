import axios from 'axios';

// Hardcode your LAN API during development for reliability
const API_URL = 'https://aikenz.ccshub.uk';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if already retried or if it's an auth error
    if (originalRequest._retry || error.response?.status === 401 || error.response?.status === 403) {
      return Promise.reject(error);
    }

    // Retry on network errors or 5xx errors (but only once)
    if (
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      (error.response?.status >= 500 && error.response?.status < 600)
    ) {
      originalRequest._retry = true;

      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        return await instance(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

// Add request interceptor for debugging
instance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

function setToken(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
}

// Check server status with retry
async function checkServerStatus() {
  try {
    const { data } = await axios.get(`${API_URL}/`, { timeout: 5000 });
    return { online: true, data };
  } catch (error) {
    // Try one more time after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const { data } = await axios.get(`${API_URL}/`, { timeout: 5000 });
      return { online: true, data };
    } catch (retryError) {
      return { online: false, error: retryError.message };
    }
  }
}

export default { ...instance, setToken, checkServerStatus, API_URL };
