import { createContext, useState, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async () => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false)
            return false
        }

      try {
        await api.get('/auth/validate');
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoading(false)
      } 
  }

const loginSuccess = ( token, name ) => {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
  setIsAuthenticated(true);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider  
        value={{ 
            isAuthenticated, 
            validateToken, 
            setIsAuthenticated, 
            loginSuccess, 
            isLoading, 
            setIsLoading,
            logout 
        }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);