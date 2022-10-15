import create from "zustand";
import {
  createNotebookAsync,
  deleteNotebookAsync,
  getNotebooksAsync,
  updateNotebookAsync,
} from "../api/notebookApi";
import { CreateNotebookInputs, UpdateNotebookInputs } from "../types/forms";
import Notebook from "../types/notebook";
import useNotes from "./useNotes";

interface NotebooksStore {
  notebooks: Notebook[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  fetch: () => Promise<void>;
  createNotebook: (value: CreateNotebookInputs) => Promise<Notebook>;
  updateNotebook: (
    id: string,
    value: UpdateNotebookInputs
  ) => Promise<Notebook | null>;
  deleteNotebook: (id: string) => Promise<Notebook | null>;
}

const useNotebooks = create<NotebooksStore>((set, get) => ({
  notebooks: [],
  selectedId: null,
  fetch: async () => {
    try {
      const notebooks = await getNotebooksAsync();
      set((state) => ({
        ...state,
        notebooks,
      }));
      console.log("NOTEBOOKS FETCH SUCCESS", notebooks);
    } catch (e) {
      console.log("FAILED TO FETCH NOTEBOOKS", e);
    }
  },
  setSelectedId: (id: string | null) => {
    set((state) => ({
      ...state,
      selectedId: id,
    }));
  },
  createNotebook: async (value: CreateNotebookInputs) => {
    const notebook = await createNotebookAsync(value);
    set((state) => ({
      ...state,
      notebooks: [...state.notebooks, notebook],
    }));
    return notebook;
  },
  updateNotebook: async (id, value: UpdateNotebookInputs) => {
    const actualNotebook = get().notebooks.find((item) => item.id === id);
    if (!actualNotebook) return null;
    set((state) => ({
      ...state,
      notebooks: state.notebooks.map((item) =>
        item.id === id
          ? {
              ...item,
              ...value,
            }
          : item
      ),
    }));
    try {
      const updatedNotebook = await updateNotebookAsync(id, value);
      set((state) => ({
        ...state,
        notebooks: state.notebooks.map((notebook) =>
          notebook.id === id ? updatedNotebook : notebook
        ),
      }));
      return updatedNotebook;
    } catch (e) {
      console.log("FAILED TO UPDATE NOTEBOOK", e);
      set((state) => ({
        ...state,
        notebooks: state.notebooks.map((item) =>
          item.id === id ? actualNotebook : item
        ),
      }));
      return null;
    }
  },
  deleteNotebook: async (id) => {
    const actualNotebook = get().notebooks.find((item) => item.id === id);
    if (!actualNotebook) return null;
    set((state) => ({
      ...state,
      notebooks: state.notebooks.filter((item) => item.id !== id),
    }));
    try {
      const deletedNote = await deleteNotebookAsync(id);
      await get().fetch();
      await useNotes.getState().fetch();
      return deletedNote;
    } catch (e) {
      console.log("FAILED TO DELETE NOTEBOOK", e);
      // Putting back the original notebook
      set((state) => ({
        ...state,
        notes: [...state.notebooks, actualNotebook],
      }));
      return null;
    }
  },
}));

export default useNotebooks;
