import { useCallback } from "react";
import { MenuItem } from "../components/context-menu";
import { useAlert } from "../contexts/alertContext";
import useNotes from "../store/useNotes";
import Note from "../types/note";

export default function useNoteContextMenu() {
  const updateNote = useNotes((state) => state.updateNote);
  const createNote = useNotes((state) => state.createNote);
  const deleteNote = useNotes((state) => state.deleteNote);
  const alert = useAlert();

  const getMenuItems = useCallback(
    (note: Note): MenuItem[] =>
      note.isDeleted
        ? [
            {
              type: "button",
              label: "Restore",
              onClick: () => {
                updateNote(note.id, {
                  isDeleted: false,
                });
              },
            },
            {
              type: "button",
              label: "Delete",
              onClick: () => {
                alert.showAlert({
                  title: `Delete "${note.title || "Untitled"}"`,
                  message: "Are you sure? This cannot be undone.",
                  actions: [
                    {
                      style: "cancel",
                    },
                    {
                      style: "destructive",
                      label: "Delete Note",
                      onClick: () => {
                        deleteNote(note.id);
                      },
                    },
                  ],
                });
              },
            },
          ]
        : [
            {
              type: "button",
              label: note.isPinned ? "Unpin" : "Pin",
              onClick: () => {
                updateNote(note.id, {
                  isPinned: !note.isPinned,
                });
              },
            },
            {
              type: "button",
              label: note.isFavorite ? "Unstar" : "Star",
              onClick: () => {
                updateNote(note.id, {
                  isFavorite: !note.isFavorite,
                });
              },
            },
            { type: "separator" },
            {
              type: "button",
              label: "Copy Link",
            },
            {
              type: "sub",
              label: "Copy as",
              items: [
                {
                  type: "button",
                  label: "Plain Text",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Markdown",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Html",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Json",
                  onClick: () => {},
                },
              ],
            },
            { type: "separator" },
            {
              type: "button",
              label: "Duplicate",
              onClick: () => {
                createNote({
                  workspaceId: note.workspaceId,
                  notebookId: note.notebookId || undefined,
                  content: note.content || undefined,
                  isPinned: note.isPinned || undefined,
                  isFavorite: note.isFavorite || undefined,
                  description: note.description,
                  meta: note.meta || undefined,
                  title: note.title || undefined,
                });
              },
            },
            {
              type: "button",
              label: "Move to",
              onClick: () => {},
            },
            {
              type: "sub",
              label: "Export as",
              items: [
                {
                  type: "button",
                  label: "Text File",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Markdown File",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Html File",
                  onClick: () => {},
                },
                {
                  type: "button",
                  label: "Json File",
                  onClick: () => {},
                },
              ],
            },
            { type: "separator" },
            {
              type: "button",
              label: "Delete",
              onClick: () => {
                updateNote(note.id, {
                  isDeleted: true,
                });
              },
            },
          ],
    [createNote, updateNote, deleteNote, alert]
  );

  return {
    getMenuItems,
  };
}
