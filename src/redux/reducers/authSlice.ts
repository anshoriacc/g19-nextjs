import { createSlice } from '@reduxjs/toolkit';
import { loginAction } from '../actions/authAction';

const initialState = {
  isLoading: false,
  userInfo: {
    id: null,
    email: null,
    username: null,
    role: null,
    name: null,
    phone: null,
    address: null,
    image: null,
  },
  accessToken: null,
  error: null,
  isSuccess: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, () => ({
        ...initialState,
        isLoading: true,
      }))
      .addCase(loginAction.fulfilled, (state, { payload }) => {
        const { token: accessToken, ...userInfo } = payload.data;
        return {
          ...state,
          isLoading: false,
          userInfo,
          accessToken,
          isSuccess: true,
          error: null,
        };
      })
      .addCase(loginAction.rejected, (state, { payload }) => ({
        ...state,
        isLoading: false,
        isSuccess: false,
        error: payload,
      }));
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
