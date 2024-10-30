import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/tenants">Inquilinos</Link></li>
        <li><Link to="/payments">Pagos</Link></li>
        <li><Link to="/receipts">Recibos</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;