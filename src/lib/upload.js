import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.199:4000';

export default async function upload(uri) {
  const form = new FormData();
  const filename = uri.split('/').pop() || `upload-${Date.now()}.jpg`;
  const type = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
  form.append('file', { uri, name: filename, type });
  const res = await axios.post(`${API_URL}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data; // { url }
}

