import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexus_auth_token');
    const savedUser = localStorage.getItem('nexus_auth_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('nexus_auth_token', res.data.token);
    localStorage.setItem('nexus_auth_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (email, password) => {
    const res = await axios.post('/api/auth/register', { email, password });
    localStorage.setItem('nexus_auth_token', res.data.token);
    localStorage.setItem('nexus_auth_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('nexus_auth_token');
    localStorage.removeItem('nexus_auth_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
