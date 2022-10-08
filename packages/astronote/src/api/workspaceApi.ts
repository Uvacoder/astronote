import axios from "axios";
import { API_URL } from "../constants";
import { CreateWorkspaceInputs } from "../types/forms";
import { Workspcae } from "../types/workspace";

export const getAllWorkspacesAsync = async (): Promise<Workspcae[]> => {
  const accessToken = localStorage.getItem("access-token");

  const { data } = await axios.get<Workspcae[]>(`${API_URL}/workspaces`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const getWorkspaceAsync = async (id: string): Promise<Workspcae> => {
  const accessToken = localStorage.getItem("access-token");
  const { data } = await axios.get<Workspcae>(`${API_URL}/workspaces/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const createWorkspaceAsync = async (body: CreateWorkspaceInputs) => {
  const accessToken = localStorage.getItem("access-token");
  const { data } = await axios.post(`${API_URL}/workspaces`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};
