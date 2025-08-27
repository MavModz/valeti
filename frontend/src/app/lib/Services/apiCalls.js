import axios from 'axios';
import { getHeaders, handleApiError } from './helper';

// Function to get token from NextAuth session
const getNextAuthToken = async () => {
  try {
    // Import NextAuth dynamically to avoid SSR issues
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    return session?.backendToken || null;
  } catch (error) {
    console.error('Error getting NextAuth token:', error);
    return null;
  }
};

export const commonrequest = async (method, url, body, header, requiresAuth = true) => {
  try {
    let config = {
      method: method,
      url,
      headers: header || getHeaders(),
      ...(body ? { data: body } : {})
    };

    // Add authentication token if required
    if (requiresAuth) {
      const token = await getNextAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make the request
    const response = await axios.request(config);
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw errorResponse;
  }
};

// GET request helper
export const getRequest = async (url, requiresAuth = true) => {
  return commonrequest('GET', url, null, null, requiresAuth);
};

// POST request helper
export const postRequest = async (url, data, requiresAuth = true) => {
  return commonrequest('POST', url, data, null, requiresAuth);
};

// PUT request helper
export const putRequest = async (url, data, requiresAuth = true) => {
  return commonrequest('PUT', url, data, null, requiresAuth);
};

// DELETE request helper
export const deleteRequest = async (url, requiresAuth = true) => {
  return commonrequest('DELETE', url, null, null, requiresAuth);
};

// PATCH request helper
export const patchRequest = async (url, data, requiresAuth = true) => {
  return commonrequest('PATCH', url, data, null, requiresAuth);
};

// File upload helper
export const uploadFile = async (url, formData, requiresAuth = true) => {
  try {
    const token = requiresAuth ? await getNextAuthToken() : null;
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post(url, formData, { headers });
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw errorResponse;
  }
};
