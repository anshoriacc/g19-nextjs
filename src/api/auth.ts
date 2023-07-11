import axiosInstance from './axios';

export interface LoginData {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
}

export const loginRequest = (data: LoginData) => {
  return axiosInstance.post('/auth/login', data);
};

export const register = (data: RegisterData) => {
  return axiosInstance.post('/auth/register', data);
};
