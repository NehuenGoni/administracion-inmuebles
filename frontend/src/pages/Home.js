import React, { useEffect, useState} from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchUserData } from '../api/usersApi';

const Home = () => {
  
  const [username, setUsername] = useState(null);


  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUserData(); 
        setUsername(localStorage.getItem('username')); 
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    
    loadUser();
  }, []);

  return (
    <Container sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        minHeight: '100vh',
        textAlign: 'center',
      }}>
      <Typography variant="h3" component="h1" gutterBottom style={{marginTop:'20px', marginBottom:'0px'}} >
        {username ? `Hola ${username}` : <CircularProgress/> }
      </Typography>
      {username &&
      <Typography variant="h5" component="h1" gutterBottom style={{marginTop:'10px', marginBottom:'30px'}} >
        que desea hacer?
      </Typography>
      }

      <Box>
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
          color="primary" 
          component={Link} 
          to="/payments"
        >
          Registrar Pagos
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
