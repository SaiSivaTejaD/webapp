// API Base URL - Update this to your Node.js backend URL
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};

// Generic CRUD operations factory
const createCRUDAPI = (resource) => ({
  getAll: () => apiCall(`/${resource}`),
  getById: (id) => apiCall(`/${resource}/${id}`),
  create: (data) => apiCall(`/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/${resource}/${id}`, {
    method: 'DELETE',
  }),
});

// Export CRUD APIs for each table
export const memberAPI = createCRUDAPI('member');
export const passAPI = createCRUDAPI('passes');
export const paymentAPI = createCRUDAPI('payments');
export const registrationAPI = createCRUDAPI('registrations');
export const seatAPI = createCRUDAPI('seats');
export const sponsorAPI = createCRUDAPI('sponsors');
export const tournamentAPI = createCRUDAPI('tournaments');
