import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as doctorService from '../../services/doctor.service';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctors();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctorById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDoctor = createAsyncThunk(
  'doctors/add',
  async (data, { rejectWithValue }) => {
    try {
      return await doctorService.createDoctor(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editDoctor = createAsyncThunk(
  'doctors/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await doctorService.updateDoctor(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeDoctor = createAsyncThunk(
  'doctors/remove',
  async (id, { rejectWithValue }) => {
    try {
      await doctorService.deleteDoctor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    selectedDoctor: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
      })
      .addCase(editDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d._id === action.payload._id);
        if (index !== -1) state.doctors[index] = action.payload;
      })
      .addCase(removeDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(d => d._id !== action.payload);
      });
  },
});

export const { clearDoctorError, clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
