import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />    
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/receipts" element={<Receipts />} />
      </Routes>
    </Router>
  );
}

export default App;
