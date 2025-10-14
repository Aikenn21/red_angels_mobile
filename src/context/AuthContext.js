import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync('token');
      if (saved) {
        setToken(saved);
        api.setToken(saved);
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    api.setToken(data.token);
    await SecureStore.setItemAsync('token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    await api.post('/auth/register', payload);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    api.setToken(null);
    await SecureStore.deleteItemAsync('token');
  };

  return <AuthContext.Provider value={{ token, user, login, logout, register, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

