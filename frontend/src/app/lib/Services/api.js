import { commonrequest } from "./apiCalls";
import { API_BASE_URL } from "./helper";

// ==================== AUTHENTICATION ENDPOINTS ====================

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/signup`, userData, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User Login
export const loginUser = async (email, password) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/signin`, { email, password }, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Login (same as user login but with admin role)
export const loginAdmin = async (email, password) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/signin`, { email, password }, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/forgot-password`, { email }, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset Password
export const resetPassword = async (token, password) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/reset-password`, { token, password }, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (token) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/auth/verify-email`, { token }, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Current User Profile
export const getCurrentUser = async () => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/auth/me`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== USER MANAGEMENT ENDPOINTS ====================

// Get All Users
export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/users?${queryString}` : `${API_BASE_URL}/users`;
    const response = await commonrequest("GET", url, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get User by ID
export const getUserById = async (userId) => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/users/${userId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update User
export const updateUser = async (userId, userData) => {
  try {
    const response = await commonrequest("PUT", `${API_BASE_URL}/users/${userId}`, userData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await commonrequest("DELETE", `${API_BASE_URL}/users/${userId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== PROPERTY ENDPOINTS ====================

// Get All Properties
export const getAllProperties = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/properties?${queryString}` : `${API_BASE_URL}/properties`;
    const response = await commonrequest("GET", url, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Property by ID
export const getPropertyById = async (propertyId) => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/properties/${propertyId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Property
export const createProperty = async (propertyData) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/properties`, propertyData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Property
export const updateProperty = async (propertyId, propertyData) => {
  try {
    const response = await commonrequest("PUT", `${API_BASE_URL}/properties/${propertyId}`, propertyData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Property
export const deleteProperty = async (propertyId) => {
  try {
    const response = await commonrequest("DELETE", `${API_BASE_URL}/properties/${propertyId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== AGENT ENDPOINTS ====================

// Get All Agents
export const getAllAgents = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/users/agents?${queryString}` : `${API_BASE_URL}/users/agents`;
    const response = await commonrequest("GET", url, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Agent by ID
export const getAgentById = async (agentId) => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/users/${agentId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Agent
export const createAgent = async (agentData) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/users/agents`, agentData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Agent
export const updateAgent = async (agentId, agentData) => {
  try {
    const response = await commonrequest("PUT", `${API_BASE_URL}/users/${agentId}`, agentData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Agent
export const deleteAgent = async (agentId) => {
  try {
    const response = await commonrequest("DELETE", `${API_BASE_URL}/users/${agentId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== CUSTOMER ENDPOINTS ====================

// Get All Customers
export const getAllCustomers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/customers?${queryString}` : `${API_BASE_URL}/customers`;
    const response = await commonrequest("GET", url, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Customer by ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/customers/${customerId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await commonrequest("PUT", `${API_BASE_URL}/customers/${customerId}`, customerData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Customer
export const deleteCustomer = async (customerId) => {
  try {
    const response = await commonrequest("DELETE", `${API_BASE_URL}/customers/${customerId}`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Customer
export const createCustomer = async (customerData) => {
  try {
    const response = await commonrequest("POST", `${API_BASE_URL}/users/customers`, customerData, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload Customer Image
export const uploadCustomerImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await commonrequest("POST", `${API_BASE_URL}/users/customers/upload-image`, formData, {
      'Content-Type': 'multipart/form-data'
    }, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== DASHBOARD ENDPOINTS ====================

// Get Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/dashboard/stats`, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Analytics Data
export const getAnalyticsData = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/dashboard/analytics?${queryString}` : `${API_BASE_URL}/dashboard/analytics`;
    const response = await commonrequest("GET", url, null, null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== FILE UPLOAD ENDPOINTS ====================

// Upload Property Image
export const uploadPropertyImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await commonrequest("POST", `${API_BASE_URL}/properties/upload-image`, formData, {
      'Content-Type': 'multipart/form-data'
    }, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload Multiple Property Images
export const uploadMultiplePropertyImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await commonrequest("POST", `${API_BASE_URL}/properties/upload-multiple-images`, formData, {
      'Content-Type': 'multipart/form-data'
    }, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload Agent Profile Image
export const uploadAgentImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await commonrequest("POST", `${API_BASE_URL}/users/agents/upload-image`, formData, {
      'Content-Type': 'multipart/form-data'
    }, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload File (Generic)
export const uploadFile = async (file, type = 'general') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await commonrequest("POST", `${API_BASE_URL}/upload`, formData, {
      'Content-Type': 'multipart/form-data'
    }, true);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== HEALTH CHECK ====================

// Health Check
export const healthCheck = async () => {
  try {
    const response = await commonrequest("GET", `${API_BASE_URL}/health`, null, null, false);
    return response.data;
  } catch (error) {
    throw error;
  }
};
