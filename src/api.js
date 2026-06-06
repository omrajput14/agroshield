const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('agroshield_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('agroshield_token');
        window.location.href = '/login';
      }
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const token = localStorage.getItem('agroshield_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('agroshield_token');
        window.location.href = '/login';
      }
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },
  
  postForm: async (endpoint, formData) => {
    // For x-www-form-urlencoded (like OAuth2 login)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }
};
