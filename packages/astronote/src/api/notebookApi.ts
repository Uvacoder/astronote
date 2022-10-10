import { axiosClient, getDefaultHeaders } from "../libs/axiosClient";
import { CreateNotebookInputs, UpdateNotebookInputs } from "../types/forms";
import Notebook from "../types/notebook";

export const getNotebooksAsync = async (
  workspaceId?: string,
  parentId?: string
) => {
  const { data } = await axiosClient.get<Notebook[]>(`/notebooks`, {
    headers: {
      ...getDefaultHeaders(),
    },
    params: {
      workspaceId,
      parentId,
    },
  });
  return data;
};

export const createNotebookAsync = async (body: CreateNotebookInputs) => {
  const { data } = await axiosClient.post<Notebook>(`/notebooks`, body, {
    headers: {
      ...getDefaultHeaders(),
    },
  });
  return data;
};

export const updateNotebookAsync = async (
  id: string,
  body: UpdateNotebookInputs
): Promise<Notebook> => {
  const { data } = await axiosClient.patch<Notebook>(`/notebooks/${id}`, body, {
    headers: {
      ...getDefaultHeaders(),
    },
  });
  return data;
};
