import { authApiRequest } from '../utils/apiClient';

export const getPatients = async () => {
  return authApiRequest('/patients');
};

export const getPatientById = async (id) => {
  return authApiRequest(`/patients/${id}`);
};

export const createPatient = async (data) => {
  return authApiRequest('/patients', {
    method: 'POST',
    body: data,
  });
};

export const updatePatient = async (id, data) => {
  return authApiRequest(`/patients/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deletePatient = async (id) => {
  return authApiRequest(`/patients/${id}`, {
    method: 'DELETE',
  });
};
