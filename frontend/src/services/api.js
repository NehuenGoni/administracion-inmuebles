import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // URL del backend
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchTenants = async () => {
  return api.get('/tenants');
};

export const registerPayment = async (paymentData) => {
  return api.post('/payments', paymentData);
};
