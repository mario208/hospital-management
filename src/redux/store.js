import { configureStore } from '@reduxjs/toolkit';
//import reducers -> 

import authReducer from './slices/authSlice';   // handles authentication (login, user data) 
import doctorReducer from './slices/doctorSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import medicalRecordReducer from './slices/medicalRecordSlice';

const store = configureStore({
    // Each key here represents a section in the global state 
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    medicalRecords: medicalRecordReducer,
  },
});

export default store;
