import { useNavigate } from "@tanstack/react-location";
import { useCallback } from "react";
import { MenuItem } from "../components/context-menu";
import CreateOrUpdateNotebookDialog from "../components/dialogs/create-or-update-notebook-dialog";
import { useAlert } from "../contexts/alertContext";
import { useDialogs } from "../contexts/dialogContext";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import Notebook from "../types/notebook";
import getNotebookPath from "../utils/getNotebookPath";
import getNotePath from "../utils/getNotePath";

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
        to: getNotePath(note),
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
        to: getNotebookPath(notebook),
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
        label: "Move to",
        onClick: () => {},
      },
      { type: "separator" },
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
    handleCreateNote,
    handleCreateNotebook,
    deleteNotebook,
    editNotebook,
    copyLink,
  };
}
