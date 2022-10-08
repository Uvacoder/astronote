import axios from "axios";
import { API_URL } from "../constants";
import { CreateNoteInputs, UpdateNoteInputs } from "../types/forms";
import Note from "../types/note";

export const getAllNotesAsync = async (
  workspaceId: string
): Promise<Note[]> => {
  const accessToken = localStorage.getItem("access-token");

  const { data } = await axios.get<Note[]>(
    `${API_URL}/notes?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.map((item) => ({ ...item, _type: "note" }));
};

export const getNoteAsync = async (
  workspaceId: string,
  noteId: string
): Promise<Note> => {
  const accessToken = localStorage.getItem("access-token");

  const { data } = await axios.get<Note>(
    `${API_URL}/notes/${noteId}?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return { ...data, _type: "note" };
};

export const createNoteAsync = async (
  body: CreateNoteInputs
): Promise<Note> => {
  const accessToken = localStorage.getItem("access-token");
  const { data } = await axios.post(`${API_URL}/notes`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    ...data,
    _type: "note",
  };
};

export const updateNoteAsync = async (props: {
  id: string;
  body: UpdateNoteInputs;
}): Promise<Note> => {
  const accessToken = localStorage.getItem("access-token");
  const { data } = await axios.patch(
    `${API_URL}/notes/${props.id}`,
    props.body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    ...data,
    _type: "note",
  };
};
