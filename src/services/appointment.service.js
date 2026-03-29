import { authApiRequest } from '../utils/apiClient';

export const createAppointment = async (data) => {
  return authApiRequest('/appointments', {
    method: 'POST',
    body: data,
  });
};

export const getAppointments = async () => {
  return authApiRequest('/appointments');
};

export const updateAppointment = async (id, data) => {
  return authApiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteAppointment = async (id) => {
  return authApiRequest(`/appointments/${id}`, {
    method: 'DELETE',
  });
};
