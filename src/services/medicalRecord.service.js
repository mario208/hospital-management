import { authApiRequest } from '../utils/apiClient';

export const createMedicalRecord = async (data) => {
  return authApiRequest('/medical-records', {
    method: 'POST',
    body: data,
  });
};

export const getMedicalRecords = async () => {
  return authApiRequest('/medical-records');
};

export const getPatientMedicalRecords = async (patientId) => {
  return authApiRequest(`/medical-records/patient/${patientId}`);
};

export const updateMedicalRecord = async (id, data) => {
  return authApiRequest(`/medical-records/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteMedicalRecord = async (id) => {
  return authApiRequest(`/medical-records/${id}`, {
    method: 'DELETE',
  });
};
