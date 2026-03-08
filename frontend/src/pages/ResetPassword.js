import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Link, CircularProgress, Alert } from '@mui/material';
import api from '../api/axiosConfig';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Este campo es obligatorio'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Este campo es obligatorio'),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (values) => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post(`/users/reset-password/${token}`, {
        password: values.password,
      });
      setMessage(response.data.message);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
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
        Nueva contraseña
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2, maxWidth: 400 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>{error}</Alert>}

      {!success && (
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors }) => (
            <Form style={{ width: '100%', maxWidth: 400 }}>
              <Field
                name="password"
                type="password"
                as={TextField}
                label="Nueva contraseña"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field
                name="confirmPassword"
                type="password"
                as={TextField}
                label="Confirmar contraseña"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Restablecer contraseña'}
              </Button>
            </Form>
          )}
        </Formik>
      )}

      <Typography variant="body2" sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/login">
          Volver al inicio de sesión
        </Link>
      </Typography>
    </div>
  );
};

export default ResetPassword;
