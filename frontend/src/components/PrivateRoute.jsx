import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading, validateToken } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      validateToken();
    }
  }, [validateToken, isLoading, isAuthenticated ]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: "Por favor inicia sesión para acceder" 
        }} 
        replace 
      />
    );
  }

  return children
};

export default PrivateRoute;