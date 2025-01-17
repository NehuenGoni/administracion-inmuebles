import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom style={{marginTop:'20px', marginBottom:'20px'}} >
        Bienvenido a la Administración de Inmuebles
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/tenants"
        sx={{ marginRight: 2 }}
      >
        Gestionar Inquilinos
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        component={Link} 
        to="/payments"
      >
        Registrar Pagos
      </Button>
    </Container>
  );
};

export default Home;
