import axios from 'axios';

// Hardcode your LAN API during development for reliability
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.199:4000';

const instance = axios.create({ baseURL: API_URL });

function setToken(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
}

export default { ...instance, setToken };
