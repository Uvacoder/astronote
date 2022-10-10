import { axiosClient, getDefaultHeaders } from "../libs/axiosClient";
import User from "../types/user";

export type GetCurrentUserResult = User;

export async function getCurrentUserAsync() {
  const { data } = await axiosClient.get<GetCurrentUserResult>(
    `/users/current`,
    {
      headers: {
        ...getDefaultHeaders(),
      },
    }
  );

  return data;
}
