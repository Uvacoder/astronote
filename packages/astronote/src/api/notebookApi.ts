import axios from "axios";
import { API_URL } from "../constants";
import { CreateNotebookInputs } from "../types/forms";
import Notebook from "../types/notebook";

export const fetchAllNotebooks = async (
  workspaceId: string
): Promise<Notebook[]> => {
  const accessToken = localStorage.getItem("access-token");

  const { data } = await axios.get<Notebook[]>(
    `${API_URL}/notebooks?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.map((item) => ({ ...item, _type: "notebook" }));
};

export const createNotebookAsync = async (
  body: CreateNotebookInputs
): Promise<Notebook> => {
  const accessToken = localStorage.getItem("access-token");
  const { data } = await axios.post(`${API_URL}/notebooks`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { ...data, _type: "notebook" };
};
