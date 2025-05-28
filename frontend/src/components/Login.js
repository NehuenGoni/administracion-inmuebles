import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Link } from '@mui/material';
import api from '../apiConfig';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const location = useLocation()
  const isLogin = location.pathname === '/login'

  const initialValues = {
    name: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('Este campo es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('Este campo es obligatorio')
  });

  const onSubmit = async (values) => {
    if(isLogin) {
      try {
        const response = await api.post('/users/login', values);
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } catch (error) {
        setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
      }
    } else {
      try {
        //const response = await api.post('/users/register', values);
        navigate('/login');
      } catch (error) {
        setErrorMessage('Error al crear cuenta. Intenta de nuevo.');
      }
    }
  };

  return (
    <div 
        style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '30px' ,
            flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        {isLogin ?  'Iniciar sesión' : 'Registrarse'}
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            {!isLogin && (
              <div>
                <Field
                  name="name"
                  as={TextField}
                  label="Nombre y Apellido"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </div>  
            )}
            <div>
              <Field
                name="email"
                as={TextField}
                label="Correo electrónico"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                as={TextField}
                label="Contraseña"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </div>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              { isLogin ? 'Iniciar sesión' : 'Registrarse' }
            </Button>
          </Form>
        )}
      </Formik>
      <Typography variant="body2" sx={{ mt: 2 }}>
        ¿No tenés una cuenta?{' '}
        <Link component={RouterLink} to="/register">
        Registrate acá
      </Link>
    </Typography>
    </div>
  );
};

export default Login;
