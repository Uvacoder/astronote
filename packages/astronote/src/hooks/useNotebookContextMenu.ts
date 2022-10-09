import { useCallback, useMemo } from "react";
import { MenuItem } from "../components/ContextMenu";
import Notebook from "../types/notebook";

export default function useNotebookContextMenu() {
  const getItems = useCallback(
    (notebook: Notebook): MenuItem[] => [
      {
        type: "button",
        label: "New Note",
      },
      {
        type: "button",
        label: "New Notebook",
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Copy Link",
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Move to",
      },
      {
        type: "button",
        label: "Edit",
      },
      {
        type: "button",
        label: "Delete",
      },
    ],
    []
  );

  return {
    getItems,
  };
}
