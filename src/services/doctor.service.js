import { authApiRequest } from '../utils/apiClient';

export const getDoctors = async () => {
  return authApiRequest('/doctors');
};

export const getDoctorById = async (id) => {
  return authApiRequest(`/doctors/${id}`);
};

export const createDoctor = async (data) => {
  return authApiRequest('/doctors', {
    method: 'POST',
    body: data,
  });
};

export const updateDoctor = async (id, data) => {
  return authApiRequest(`/doctors/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteDoctor = async (id) => {
  return authApiRequest(`/doctors/${id}`, {
    method: 'DELETE',
  });
};
