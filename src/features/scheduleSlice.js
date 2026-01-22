import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleService from './scheduleService';

export const fetchTodaySchedule = createAsyncThunk(
  'schedule/fetchTodaySchedule',
  async (_, thunkAPI) => {
    try {
      const response = await scheduleService.fetchTodaySchedule();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch schedule';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    liveProgram: null,
    upcomingPrograms: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetSchedule: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaySchedule.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTodaySchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.liveProgram = action.payload.liveProgram;
        state.upcomingPrograms = action.payload.upcomingPrograms;
      })
      .addCase(fetchTodaySchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
