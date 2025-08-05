import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Link, CircularProgress } from '@mui/material';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, loginSuccess, isLoading, setIsLoading } = useAuth()

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

  useEffect(() => {
    setErrorMessage('')
  }, [location.pathname])

  const onSubmit = async (values, {resetForm} ) => {
    setIsLoading(true)
    setErrorMessage('')
    if(isLogin) {
      try {
        const response = await api.post('/users/login', values);
        loginSuccess(response.data.token);
        setIsAuthenticated(true)
        setIsLoading(false)
        navigate('/');
      } catch (error) {
        setIsLoading(false)
        setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
      }
    } else {
      try {
        const response = await api.post('/users/register', values);
        setErrorMessage(response.data.message)
        setIsLoading(false)
        resetForm()
        setTimeout(() => {
          navigate('/login')
        }, 3000);
      } catch (error) {
        setIsLoading(false)
        setErrorMessage(error.response.data.message);
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
        key={location.pathname}
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
              {isLoading 
                ? <CircularProgress size={24} color='inherit' /> 
                : ( isLogin ? 'Iniciar sesión' : 'Registrarse' )
                }
            </Button>
          </Form>
        )}
      </Formik>
      {isLogin && (
      <Typography variant="body2" sx={{ mt: 2 }}>
          ¿No tenés una cuenta?{' '}
          <Link component={RouterLink} to="/register">
          Registrate acá
        </Link>
      </Typography>
    )}      
    {!isLogin && (
      <Typography variant="body2" sx={{ mt: 2 }}>
          Cuenta creada?{' '}
          <Link component={RouterLink} to="/login">
          Inicia sesión ACA
        </Link>
      </Typography>
    )}
    </div>
  );
};

export default Login;
