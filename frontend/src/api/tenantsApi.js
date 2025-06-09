import api from './axiosConfig';

export const getTenants = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await api.get('/tenants',
      {
        headers: { Authorization: `Bearer ${token}`}
      }
    );
    return response.data 
  } catch (error) {
    console.error('Error al obtener los inquilinos:', error);
  }
};

export const createTenant = async (newTenantData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/tenants',
      {
        name: newTenantData.name,
        department: newTenantData.department,
        status: null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear un nuevo inquilino:', error);
    throw error;
  }
};

export const deleteTenant = async (tenantId) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/tenants/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error al eliminar el inquilino:', error);
    throw error;
  }
};

export const updateTenant = async (id, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/tenants/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el inquilino:', error);
    throw error;
  }
};