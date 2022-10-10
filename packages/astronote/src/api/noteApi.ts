import { axiosClient, getDefaultHeaders } from "../libs/axiosClient";
import { CreateNoteInputs, UpdateNoteInputs } from "../types/forms";
import Note from "../types/note";

export const getNotesAsync = async (
  workspaceId?: string,
  notebookId?: string
) => {
  const { data } = await axiosClient.get<Note[]>(`/notes`, {
    headers: {
      ...getDefaultHeaders(),
    },
    params: {
      workspaceId,
      notebookId,
    },
  });

  return data;
};

export const getNoteAsync = async (noteId: string) => {
  const { data } = await axiosClient.get<Note>(`/notes/${noteId}`, {
    headers: {
      ...getDefaultHeaders(),
    },
  });

  return data;
};

export const createNoteAsync = async (body: CreateNoteInputs) => {
  const { data } = await axiosClient.post<Note>(`/notes`, body, {
    headers: {
      ...getDefaultHeaders(),
    },
  });

  return data;
};

export const updateNoteAsync = async (id: string, body: UpdateNoteInputs) => {
  const { data } = await axiosClient.patch<Note>(`/notes/${id}`, body, {
    headers: {
      ...getDefaultHeaders(),
    },
  });

  return data;
};
