import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import api from './api';

const API_URL = api.API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.105:4000';

/**
 * Compresses and resizes image to reduce file size
 * This prevents network errors with large images
 */
async function compressImage(uri) {
  try {
    console.log('[Upload] Compressing image...');

    // Resize to max 1920px width (maintains aspect ratio)
    // Compress to 0.7 quality (good balance between quality and size)
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1920 } }], // Resize if larger than 1920px
      {
        compress: 0.7, // 70% quality
        format: ImageManipulator.SaveFormat.JPEG // Always save as JPEG
      }
    );

    console.log('[Upload] Image compressed successfully');
    return manipResult.uri;
  } catch (error) {
    console.warn('[Upload] Image compression failed, using original:', error.message);
    // If compression fails, use original image
    return uri;
  }
}

export async function uploadFile(uri, options = {}) {
  try {
    // Compress image before uploading (reduces size significantly)
    const compressedUri = options.skipCompression ? uri : await compressImage(uri);

    const form = new FormData();
    const filename = compressedUri.split('/').pop() || `upload-${Date.now()}.jpg`;

    // Always use JPEG for consistency and better compression
    const type = 'image/jpeg';

    // Append file to form data
    form.append('file', {
      uri: compressedUri,
      name: filename,
      type
    });

    // Get auth token from api instance
    const token = api.defaults.headers.common['Authorization'];

    console.log('[Upload] Starting file upload:', filename);

    const res = await axios.post(`${API_URL}/upload`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': token } : {})
      },
      timeout: 90000, // 90 second timeout
      maxContentLength: 30 * 1024 * 1024, // 30MB
      maxBodyLength: 30 * 1024 * 1024 // 30MB
    });

    console.log('[Upload] Upload successful:', res.data.url);
    return res.data.url; // Return just the URL string
  } catch (error) {
    console.error('[Upload] Upload error:', error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 25MB');
    }
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again');
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Upload timeout. Please check your connection and try again');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again');
    }

    throw new Error(error.response?.data?.error || error.message || 'Upload failed');
  }
}

// Default export for backward compatibility
export default uploadFile;

