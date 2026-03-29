import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medicalRecordService from '../../services/medicalRecord.service';

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await medicalRecordService.getMedicalRecords();
      return data.records || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientRecords = createAsyncThunk(
  'medicalRecords/fetchPatient',
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await medicalRecordService.getPatientMedicalRecords(patientId);
      return data.records || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMedicalRecord = createAsyncThunk(
  'medicalRecords/add',
  async (data, { rejectWithValue }) => {
    try {
      const result = await medicalRecordService.createMedicalRecord(data);
      return result.record || result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editMedicalRecord = createAsyncThunk(
  'medicalRecords/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await medicalRecordService.updateMedicalRecord(id, data);
      return result.record || result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMedicalRecord = createAsyncThunk(
  'medicalRecords/remove',
  async (id, { rejectWithValue }) => {
    try {
      await medicalRecordService.deleteMedicalRecord(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const medicalRecordSlice = createSlice({
  name: 'medicalRecords',
  initialState: {
    records: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearMedicalRecordError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All (Doctor)
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Patient specific (Patient)
      .addCase(fetchPatientRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchPatientRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addMedicalRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMedicalRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        // Insert at beginning to maintain newest-first assumed order
        state.records.unshift(action.payload);
      })
      .addCase(addMedicalRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Edit
      .addCase(editMedicalRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(a => a._id === action.payload._id);
        if (index !== -1) state.records[index] = action.payload;
      })
      // Remove
      .addCase(removeMedicalRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(a => a._id !== action.payload);
      });
  },
});

export const { clearMedicalRecordError } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
