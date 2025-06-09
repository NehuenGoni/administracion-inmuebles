import api from './axiosConfig';

export const fetchPayments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
      console.error('Error al obtener los pagos:', error);
  console.error('Detalle del error:', error.response);
    throw error;
  }
};

export const fetchPaymentsByTenantId = async (tenantId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/payments/tenant/${tenantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los pagos del inquilino ${tenantId}:`, error);
    console.error('Detalle del error:', error.response);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/payments', paymentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el pago:', error);
    throw error;
  }
};

export const updatePayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const paymentToSubmit = { ...paymentData };

    if (paymentToSubmit.tenantId && typeof paymentToSubmit.tenantId === 'object') {
      paymentToSubmit.tenantId = paymentToSubmit.tenantId._id;
    }

    const response = await api.put(`/payments/${paymentData._id}`, paymentToSubmit, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    throw error;
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error al eliminar el pago:', error.response?.data || error.message);
    throw error;
  }
};