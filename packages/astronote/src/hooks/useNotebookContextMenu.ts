import { useNavigate } from "@tanstack/react-location";
import { useCallback } from "react";
import { MenuItem } from "../components/ContextMenu";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import Notebook from "../types/notebook";

export default function useNotebookContextMenu() {
  const createNote = useNotes((state) => state.createNote);
  const createNotebook = useNotebooks((state) => state.createNotebook);
  const deleteNotebook = useNotebooks((state) => state.deleteNotebook);
  const navigate = useNavigate();

  const handleCreateNote = useCallback(
    async (parent: Notebook) => {
      const note = await createNote({
        workspaceId: parent.workspaceId,
        notebookId: parent.id,
      });
      navigate({
        to: `/${parent.workspaceId}/notes/${note.id}`,
      });
    },
    [createNote, navigate]
  );

  const handleCreateNotebook = useCallback(
    async (parent: Notebook) => {
      const notebook = await createNotebook({
        workspaceId: parent.workspaceId,
        parentId: parent.id,
        name: "Untitled",
      });
      navigate({
        to: `/${notebook.workspaceId}/notebooks/${notebook.id}`,
      });
    },
    [createNotebook, navigate]
  );

  const editNotebook = useCallback((notebook: Notebook) => {
    alert("TODO: Edit Notebook link");
  }, []);

  const copyLink = useCallback((notebook: Notebook) => {
    alert("TODO: Copy Notebook link");
  }, []);

  const getItems = useCallback(
    (notebook: Notebook): MenuItem[] => [
      {
        type: "button",
        label: "New Note",
        onClick: () => handleCreateNote(notebook),
      },
      {
        type: "button",
        label: "New Notebook",
        onClick: () => handleCreateNotebook(notebook),
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Copy Link",
        onClick: () => copyLink(notebook),
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Edit",
        onClick: () => editNotebook(notebook),
      },
      {
        type: "button",
        label: "Delete",
        onClick: () => {
          deleteNotebook(notebook.id);
        },
      },
    ],
    [
      handleCreateNote,
      handleCreateNotebook,
      deleteNotebook,
      editNotebook,
      copyLink,
    ]
  );

  return {
    getItems,
    createNote: handleCreateNote,
    createNotebook: handleCreateNotebook,
    deleteNotebook,
    editNotebook,
    copyLink,
  };
}
