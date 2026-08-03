import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const runCheck = async () => {
      setAuthError(null);
      setIsLoadingAuth(true);
      try {
        const res = await api.get('/auth/me');
        if (!isMounted) return;
        const currentUser = res?.data?.data || res?.data?.user || null;
        const isValidAdmin = currentUser && ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);
        setUser(isValidAdmin ? currentUser : null);
        setIsAuthenticated(Boolean(isValidAdmin));
      } catch (error) {
        if (!isMounted) return;
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError({ type: 'auth_required', message: error?.message || 'Authentication required' });
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    };

    runCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  const checkAppState = useCallback(async () => {
    setAuthError(null);
    setIsLoadingAuth(true);
    try {
      const res = await api.get('/auth/me');
      const currentUser = res?.data?.data || res?.data?.user || null;
      const isValidAdmin = currentUser && ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);
      setUser(isValidAdmin ? currentUser : null);
      setIsAuthenticated(Boolean(isValidAdmin));
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError({ type: 'auth_required', message: error?.message || 'Authentication required' });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkUserAuth = useCallback(async () => {
    await checkAppState();
  }, [checkAppState]);

  const logout = async (shouldRedirect = true) => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem('admin_token');

    if (shouldRedirect) {
      navigate('/login', { replace: true });
    }
  };

  const navigateToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
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
