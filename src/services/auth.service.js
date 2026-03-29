import { apiRequest } from '../utils/apiClient';

export const registerUser = async (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  });
};

export const loginUser = async ({ email, password }) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
};
