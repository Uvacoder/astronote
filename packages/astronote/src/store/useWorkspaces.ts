import create from "zustand";
import {
  createWorkspaceAsync,
  getWorkspacesAsync,
  updateWorkspaceAsync,
} from "../api/workspaceApi";
import { CreateWorkspaceInputs, UpdateWorkspaceInputs } from "../types/forms";
import Workspcae from "../types/workspace";

interface WorkspacesStore {
  workspaces: Workspcae[];
  fetch: () => Promise<void>;
  createWrokspace: (body: CreateWorkspaceInputs) => Promise<Workspcae>;
  updateWorkspace: (
    id: string,
    body: UpdateWorkspaceInputs
  ) => Promise<Workspcae | null>;
}

const useWroksapces = create<WorkspacesStore>((set, get) => ({
  workspaces: [],
  fetch: async () => {
    try {
      const workspaces = await getWorkspacesAsync();
      set((state) => ({
        ...state,
        workspaces,
      }));
      console.log("WORKSPACES FETCH SUCCESS", workspaces);
    } catch (e) {
      console.log("FAILED TO FETCH WORKSPACES", e);
    }
  },
  createWrokspace: async (body) => {
    const workspace = await createWorkspaceAsync(body);
    set((state) => ({
      ...state,
      workspaces: [...state.workspaces, workspace],
    }));
    return workspace;
  },
  updateWorkspace: async (id, value) => {
    const actualWorkspace = get().workspaces.find((item) => item.id === id);
    if (!actualWorkspace) return null;
    set((state) => ({
      ...state,
      workspaces: state.workspaces.map((item) =>
        item.id === id ? { ...item, ...value } : item
      ),
    }));

    try {
      const updatedWorkspace = await updateWorkspaceAsync(id, value);
      return updatedWorkspace;
    } catch (e) {
      console.log("FAILED TO UPDATE WORKSPACE", e);
      set((state) => ({
        ...state,
        workspaces: state.workspaces.map((item) =>
          item.id === id ? actualWorkspace : item
        ),
      }));
      return null;
    }
  },
}));

export default useWroksapces;
