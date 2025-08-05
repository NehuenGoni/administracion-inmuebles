import React, {useEffect, useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { validateToken } = useAuth();
  const hasRun = useRef(false);
  
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const publicRoutes = ['/login', '/register'];
    
    if (publicRoutes.includes(location.pathname)) return;

    validateToken().then(valid => {
      if (!valid) navigate('/login');
    }); 
  }, [location.pathname, navigate, validateToken]);


return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.primary,
            paddingTop: '64px',
          }}
        >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/tenants" element={<PrivateRoute><Tenants /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
          <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
        </Routes>
        </Box>
      </ThemeProvider>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
