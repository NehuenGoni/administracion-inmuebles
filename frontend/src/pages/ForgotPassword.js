import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Link, CircularProgress, Alert } from '@mui/material';
import api from '../api/axiosConfig';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('Este campo es obligatorio'),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/users/forgot-password', values);
      setMessage(response.data.message);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30px',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Recuperar contraseña
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, maxWidth: 400, textAlign: 'center' }}>
        Ingresá tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2, maxWidth: 400 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>{error}</Alert>}

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form style={{ width: '100%', maxWidth: 400 }}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar enlace'}
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/login">
          Volver al inicio de sesión
        </Link>
      </Typography>
    </div>
  );
};

export default ForgotPassword;
