import { useNavigate } from "@tanstack/react-location";
import { useCallback } from "react";
import { MenuItem } from "../components/ContextMenu";
import CreateOrUpdateNotebookDialog from "../components/CreateOrUpdateNotebookDialog";
import { useAlert } from "../contexts/alertContext";
import { useDialogs } from "../contexts/dialogContext";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import Notebook from "../types/notebook";

export default function useNotebookContextMenu() {
  const createNote = useNotes((state) => state.createNote);
  const createNotebook = useNotebooks((state) => state.createNotebook);
  const deleteNotebook = useNotebooks((state) => state.deleteNotebook);
  const navigate = useNavigate();
  const alert = useAlert();
  const dialog = useDialogs();

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
  const editNotebook = useCallback((notebook: Notebook) => {}, []);
  const copyLink = useCallback((notebook: Notebook) => {}, []);

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
        onClick: () => {
          dialog.showDialog({
            title: "Create Notebook",
            content: (
              <CreateOrUpdateNotebookDialog
                type="create"
                parentId={notebook.id}
                workspaceId={notebook.workspaceId}
              />
            ),
          });
        },
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
        onClick: () => {
          dialog.showDialog({
            title: "Update Notebook",
            content: (
              <CreateOrUpdateNotebookDialog type="update" notebook={notebook} />
            ),
          });
        },
      },
      {
        type: "button",
        label: "Delete",
        onClick: () => {
          alert.showAlert({
            title: `Delete "${notebook.name}"?`,
            message: "Notes inside this will not be deleted",
            actions: [
              {
                style: "cancel",
              },
              {
                style: "destructive",
                label: "Delete Notebook",
                onClick: () => {
                  deleteNotebook(notebook.id);
                },
              },
            ],
          });
        },
      },
    ],
    [
      handleCreateNote,
      handleCreateNotebook,
      deleteNotebook,
      editNotebook,
      copyLink,
      alert,
      dialog,
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
