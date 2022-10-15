import { Outlet, useMatch } from "@tanstack/react-location";
import { useEffect } from "react";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";
import NotebookHeader from "./NotebookHeader";

export default function NotebookScreen() {
  const {
    params: { workspaceId, notebookId },
  } = useMatch<LocationGenerics>();
  const notebook = useNotebooks((state) =>
    state.notebooks.find((item) => item.id === notebookId)
  );
  const setSelectedNotebookId = useNotebooks((state) => state.setSelectedId);
  const childNotes = useNotes((state) =>
    state.notes
      .filter(
        (item) =>
          item.workspaceId === workspaceId &&
          !item.isDeleted &&
          item.notebookId === notebookId
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );
  const childNotebooks = useNotebooks((state) =>
    state.notebooks
      .filter(
        (item) =>
          item.workspaceId === workspaceId && item.parentId === notebookId
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  useEffect(() => {
    if (!notebookId) return;
    setSelectedNotebookId(notebookId);
    return () => {
      setSelectedNotebookId(null);
    };
  }, [notebookId, setSelectedNotebookId]);

  if (!notebook) {
    return <div>Notebook not found</div>;
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <NotebookHeader notebook={notebook} />
        <div className="flex-1 overflow-y-auto">
          <NotesAndFoldersTable notes={childNotes} notebooks={childNotebooks} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
