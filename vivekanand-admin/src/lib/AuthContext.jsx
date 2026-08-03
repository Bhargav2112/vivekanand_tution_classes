import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '@/api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const res = await api.get('/auth/me');
      const currentUser = res?.data?.data || res?.data?.user || null;
      const isValidAdmin = currentUser && ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);
      if (isValidAdmin) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { email: username, password });
    if (res?.data?.success) {
      if (res.data.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
      }
      if (res.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.refresh_token);
      }
      await checkAuth();
      return res.data;
    }
    throw new Error(res?.data?.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  const isSuperAdmin = Boolean(
    user && (
      user.role === 'Super Admin' ||
      user.username === 'admin1' ||
      user.name === 'admin1' ||
      user.email === 'admin1@vivekanand.com'
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSuperAdmin,
        authChecked,
        loading: isLoadingAuth || !authChecked,
        isLoadingAuth,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
