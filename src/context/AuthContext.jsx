import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and fetch user profile
    const token = localStorage.getItem('agroshield_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await api.get('/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('agroshield_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // FastAPI OAuth2PasswordRequestForm uses form data
      const data = {
        username: email,
        password: password
      };
      
      const response = await api.postForm('/auth/login', data);
      localStorage.setItem('agroshield_token', response.access_token);
      
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('agroshield_token');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
