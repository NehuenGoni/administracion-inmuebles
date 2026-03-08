import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import Home from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const navButtonStyles = {
  margin: '0 10px',
  color: 'white',
};

const NavBar = ({ toggleDarkMode }) => {
  const {isAuthenticated, logout, isSuperAdmin, hasPermission} = useAuth()

  return (
    <AppBar position="static" style={{ marginBottom: '16px' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
          Gestión de Inquilinos
        </Typography>

        {isAuthenticated && (
          <>
          <Button 
            color="secondary" 
            sx={navButtonStyles}
            component={Link} 
            startIcon={<Home/>}
            to="/"
          >
            Inicio
          </Button>
          {hasPermission('tenants:read') && (
          <Button
            color="secondary"
            sx={navButtonStyles}
            component={Link}
            startIcon={<PeopleIcon/>}
            to="/tenants"
          >
            Inquilinos
          </Button>
          )}
          {hasPermission('payments:read') && (
          <Button
            color="secondary"
            sx={navButtonStyles}
            component={Link}
            startIcon={<PaymentIcon/>}
            to="/payments"
          >
            Pagos
          </Button>
          )}
          {isSuperAdmin && (
          <Button
            color="secondary"
            sx={navButtonStyles}
            component={Link}
            startIcon={<AdminPanelSettingsIcon/>}
            to="/admin"
          >
            Admin
          </Button>
          )}
          <Button
            color="secondary"
            sx={navButtonStyles}
            component={Link}
            startIcon={<LogoutIcon/>}
            onClick={() => {logout()}}
          >
            Logout
          </Button>
          </>
          )}
          <>
          <IconButton onClick={toggleDarkMode} color="inherit">
            <Brightness4Icon />
          </IconButton>
          </>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;