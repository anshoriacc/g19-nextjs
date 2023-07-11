import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginData, loginRequest } from '@/api/auth';

export const loginAction = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await loginRequest(data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
