import api from './axiosConfig';

export const fetchAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const fetchValidPermissions = async () => {
  const response = await api.get('/admin/permissions');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const updateUserPermissions = async (userId, permissions) => {
  const response = await api.put(`/admin/users/${userId}/permissions`, { permissions });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};
