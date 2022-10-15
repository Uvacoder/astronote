import { axiosClient, getDefaultHeaders } from "../libs/axiosClient";
import { CreateWorkspaceInputs, UpdateWorkspaceInputs } from "../types/forms";
import { Workspcae } from "../types/workspace";

export const getWorkspacesAsync = async () => {
  const { data } = await axiosClient.get<Workspcae[]>(`/workspaces`, {
    headers: {
      ...getDefaultHeaders(),
    },
  });
  return data;
};

export const getWorkspaceAsync = async (id: string) => {
  const { data } = await axiosClient.get<Workspcae>(`/workspaces/${id}`, {
    headers: {
      ...getDefaultHeaders(),
    },
  });
  return data;
};

export const createWorkspaceAsync = async (body: CreateWorkspaceInputs) => {
  const { data } = await axiosClient.post<Workspcae>(`/workspaces`, body, {
    headers: {
      ...getDefaultHeaders(),
    },
  });
  return data;
};

export const updateWorkspaceAsync = async (
  id: string,
  body: UpdateWorkspaceInputs
) => {
  const { data } = await axiosClient.patch<Workspcae>(
    `/workspaces/${id}`,
    body,
    {
      headers: {
        ...getDefaultHeaders(),
      },
    }
  );
  return data;
};
