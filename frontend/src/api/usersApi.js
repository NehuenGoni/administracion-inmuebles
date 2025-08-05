import api from './axiosConfig';

export const fetchUserData = async () => {
  try {
    const response = await api.get('/users/me');
    localStorage.setItem('username', response.data.name)
    return response.data; 
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; 
  }
};

export const updateUserProfile = async (data) => {
  return api.patch('/api/users/profile', data);
};