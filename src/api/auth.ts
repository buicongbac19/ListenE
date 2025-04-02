import axios, { endpoints } from "../utils/axios";
import {
  IUserLoginItem,
  IUserRegisterItem,
  IUserResetPasswordItem,
} from "../types/user";

export const login = (data: IUserLoginItem) => {
  return axios.post(endpoints.register.login, data);
};
export const registerUser = (data: IUserRegisterItem) => {
  return axios.post(endpoints.register.register, data);
};

export const logout = () => {
  return axios.delete(endpoints.register.logout);
};

export const sendVerifyEmailCode = (email: string) => {
  return axios.post(endpoints.register.verifyEmail, { email });
};

export const verifyEmail = (email: string, code: string) => {
  return axios.put(endpoints.register.verifyEmail, { email, code });
};

export const sendResetPasswordCode = (email: string) => {
  return axios.post(endpoints.register.sendresetPasswordCode, { email });
};

export const resetPassword = (data: IUserResetPasswordItem) => {
  return axios.put(endpoints.register.resetPassword, data);
};
