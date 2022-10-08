import axios from "axios";
import { API_URL } from "../constants";
import User from "../types/user";

export type GetCurrentUserResult = User;

export async function getCurrentUserAsync() {
  const accessToken = localStorage.getItem("access-token");

  const { data } = await axios.get<GetCurrentUserResult>(
    `${API_URL}/users/current`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}
