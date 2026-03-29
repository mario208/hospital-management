import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as patientService from '../../services/patient.service';

export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getPatients();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await patientService.getPatientById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPatient = createAsyncThunk(
  'patients/add',
  async (data, { rejectWithValue }) => {
    try {
      return await patientService.createPatient(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editPatient = createAsyncThunk(
  'patients/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await patientService.updatePatient(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePatient = createAsyncThunk(
  'patients/remove',
  async (id, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    selectedPatient: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPatientError: (state) => {
      state.error = null;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      })
      .addCase(editPatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.patients[index] = action.payload;
      })
      .addCase(removePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearPatientError, clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
