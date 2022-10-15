import { axiosClient } from "../libs/axiosClient";
import { LogInInputs } from "../types/forms";
import User from "../types/user";

export type LogInResult = {
  user: User;
  accessToken: string;
};
export async function logInAsync(dto: LogInInputs) {
  const { data } = await axiosClient.post<LogInResult>(`/auth/login`, dto);
  return data;
}

export type SignUpDto = {
  name: string;
  username: string;
  email: string;
  password: string;
};
export type SignUpResult = {
  user: User;
  accessToken: string;
};
export async function signUpAsync(dto: SignUpDto) {
  const { data } = await axiosClient.post<SignUpResult>(`/auth/signup`, dto);
  return data;
}
