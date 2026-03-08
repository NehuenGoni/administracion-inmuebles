import { createContext, useState, useContext, useCallback } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  const validateToken = async () => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false)
            return false
        }

      try {
        const response = await api.get('/users/me');
        setIsAuthenticated(true);
        setUserRole(response.data.role);
        setUserPermissions(response.data.permissions || []);
        return true;
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserPermissions([]);
        return false;
      } finally {
        setIsLoading(false)
      }
  }

const loginSuccess = ( token, name, role, permissions ) => {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
  setIsAuthenticated(true);
  setUserRole(role);
  setUserPermissions(permissions || []);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserPermissions([]);
  };

  const hasPermission = useCallback((permission) => {
    if (userRole === 'superadmin') return true;
    return userPermissions.includes(permission);
  }, [userRole, userPermissions]);

  const isSuperAdmin = userRole === 'superadmin';

  return (
    <AuthContext.Provider
        value={{
            isAuthenticated,
            validateToken,
            setIsAuthenticated,
            loginSuccess,
            isLoading,
            setIsLoading,
            logout,
            userRole,
            userPermissions,
            hasPermission,
            isSuperAdmin,
        }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);