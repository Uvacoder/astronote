import axios from "axios";
import { API_URL } from "../constants";
import User from "../types/user";

export type LogInDto = {
  email: string;
  password: string;
};
export type LogInResult = {
  user: User;
  accessToken: string;
};
export async function logInAsync(dto: LogInDto) {
  const { data } = await axios.post<LogInResult>(`${API_URL}/auth/login`, dto);
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
  const { data } = await axios.post<SignUpResult>(
    `${API_URL}/auth/signup`,
    dto
  );
  return data;
}
