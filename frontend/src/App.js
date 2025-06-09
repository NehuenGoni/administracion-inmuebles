import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import api from './api/axiosConfig';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await api.get('/auth/validate', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/tenants" element={<PrivateRoute><Tenants /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
        <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
