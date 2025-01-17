import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/material/Menu';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#1976d2', marginBottom: '16px' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
          Gestión de Inquilinos
        </Typography>
        <Button 
        color="secondary" 
        sx={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
        component={Link} 
        to="/"
        >
          Inicio
        </Button>
        <Button 
        color="secondary" 
        sx={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
        component={Link} 
        to="/tenants"
        >
          Inquilinos
        </Button>
        <Button 
        color="secondary" 
        sx={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}
        component={Link} 
        to="/payments"
        >
          Pagos
        </Button>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;