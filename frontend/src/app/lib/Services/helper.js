// Backend URL configuration
export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// API base URL
export const API_BASE_URL = `${backend_url}/api`;

// Common headers
export const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Common error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Network error
    return {
      success: false,
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    // Other error
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};
