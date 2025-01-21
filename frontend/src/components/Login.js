import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography } from '@mui/material';
import api from '../apiConfig';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const initialValues = {
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
    try {
      const response = await api.post('/users/login', values);
      localStorage.setItem('token', response.data.token);
      navigate.push('/');
    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
    }
  };

  return (
    <div 
        style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Iniciar sesión
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form>
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
              Iniciar sesión
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
