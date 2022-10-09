import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { updateNoteAsync } from "../api/noteApi";
import { MenuItem } from "../components/ContextMenu";
import Note from "../types/note";

export default function useNoteContextMenu() {
  const updateMut = useMutation(updateNoteAsync);
  const queryClient = useQueryClient();

  const duplicateNote = useCallback((note: Note) => {
    alert("TODO: Duplicate Note");
  }, []);

  const copyLink = useCallback((note: Note) => {
    alert("TODO: Duplicate Note");
  }, []);

  const copyNote = useCallback(
    (note: Note, as: "plain" | "markdown" | "html" | "json") => {
      alert(`TODO: Copy Note as ${as}`);
    },
    []
  );

  const exportNote = useCallback(
    (note: Note, as: "txt" | "md" | "html" | "json") => {
      alert(`TODO: Export Note as ${as}`);
    },
    []
  );

  const toggleDeleted = useCallback(
    async (note: Note) => {
      await updateMut.mutateAsync({
        id: note.id,
        body: {
          isDeleted: !note.isDeleted,
        },
      });
      queryClient.invalidateQueries(["notes", note.workspaceId]);
    },
    [updateMut, queryClient]
  );

  const toggleFavorite = useCallback(
    async (note: Note) => {
      await updateMut.mutateAsync({
        id: note.id,
        body: {
          isFavorite: !note.isFavorite,
        },
      });
      queryClient.invalidateQueries(["notes", note.workspaceId]);
    },
    [updateMut, queryClient]
  );

  const togglePinned = useCallback(
    async (note: Note) => {
      await updateMut.mutateAsync({
        id: note.id,
        body: {
          isPinned: !note.isPinned,
        },
      });
      queryClient.invalidateQueries(["notes", note.workspaceId]);
    },
    [updateMut, queryClient]
  );

  const getMenuItems = useCallback(
    (note: Note): MenuItem[] => [
      {
        type: "button",
        label: note.isPinned ? "Remove from Sidebar" : "Pin to sidebar",
        onClick: () => togglePinned(note),
      },
      {
        type: "button",
        label: note.isFavorite ? "Remove from favorites" : "Add to favorites",
        onClick: () => toggleFavorite(note),
      },
      { type: "separator" },
      {
        type: "button",
        label: "Duplicate",
        onClick: () => duplicateNote(note),
      },
      {
        type: "button",
        label: "Copy Link",
        onClick: () => copyLink(note),
      },
      {
        type: "sub",
        label: "Copy as",
        items: [
          {
            type: "button",
            label: "Plain Text",
            onClick: () => copyNote(note, "plain"),
          },
          {
            type: "button",
            label: "Markdown",
            onClick: () => copyNote(note, "markdown"),
          },
          {
            type: "button",
            label: "Html",
            onClick: () => copyNote(note, "html"),
          },
          {
            type: "button",
            label: "Json",
            onClick: () => copyNote(note, "json"),
          },
        ],
      },
      { type: "separator" },
      {
        type: "sub",
        label: "Export as",
        items: [
          {
            type: "button",
            label: "Text File",
            onClick: () => exportNote(note, "txt"),
          },
          {
            type: "button",
            label: "Markdown File",
            onClick: () => exportNote(note, "md"),
          },
          {
            type: "button",
            label: "Html File",
            onClick: () => exportNote(note, "html"),
          },
          {
            type: "button",
            label: "Json File",
            onClick: () => exportNote(note, "json"),
          },
        ],
      },
      {
        type: "button",
        label: note.isDeleted ? "Remove from Trash" : "Move to Trash",
        onClick: () => toggleDeleted(note),
      },
    ],
    [
      duplicateNote,
      copyLink,
      copyNote,
      exportNote,
      toggleDeleted,
      toggleFavorite,
      togglePinned,
    ]
  );

  return {
    getMenuItems,
    copyLink,
    toggleDeleted,
    copyNote,
    exportNote,
    duplicateNote,
    toggleFavorite,
  };
}
