import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />          
        <Route path="/register" element={<Login />} /> 

        <Route path="/" element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/tenants" element={<PrivateRoute> <Tenants /> </PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute> <Payments /> </PrivateRoute>} />
        <Route path="/receipts" element={<PrivateRoute> <Receipts /> </PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
