import api from './axiosConfig';

export const getTenants = async () => {
  try {
    const response = await api.get('/tenants');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los inquilinos:', error);
    throw error;
  }
};

export const createTenant = async (tenantData) => {
    try {
      const response = await api.post('/tenants', tenantData);
      return response.data;
    } catch (error) {
      console.error('Error al crear un nuevo inquilino:', error);
      throw error;
    }
  };