import { useMatch, useNavigate } from "@tanstack/react-location";
import { useMemo, useCallback } from "react";
import { FiFolderPlus, FiFilePlus, FiMoreHorizontal } from "react-icons/fi";
import CreateNotebookDialog from "../components/CreateNotebookDialog";
import NotesAndFoldersTable from "../components/NotesAndFoldersTable";
import PageHeader from "../components/PageHeader";
import newNoteDefaultContent from "../data/newNoteDefaultContent";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import iBroadCrumb from "../types/broadCrumb";
import { LocationGenerics } from "../types/locationGenerics";
import Notebook from "../types/notebook";

export default function NotebookScreen() {
  const navigate = useNavigate();
  const {
    params: { workspaceId, notebookId },
  } = useMatch<LocationGenerics>();
  const notebook = useNotebooks((state) =>
    state.notebooks.find((item) => item.id === notebookId)
  );
  const notes = useNotes((state) =>
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
  const notebooks = useNotebooks((state) =>
    state.notebooks
      .filter(
        (item) =>
          item.workspaceId === workspaceId && item.parentId === notebookId
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  );
  const allNotebooks = useNotebooks((state) =>
    state.notebooks.filter((item) => item.workspaceId === workspaceId)
  );
  const createNote = useNotes((state) => state.createNote);

  const broadCrumbs = useMemo(() => {
    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = allNotebooks.find((item) => item.id === file.parentId);
      return [
        {
          id: file.id,
          label: `${file.emoji ? `${file.emoji} ` : ""}${file.name}`,
          to: `/${file.workspaceId}/notebooks/${file.id}`,
        },
        ...(!parent
          ? []
          : parent.parentId
          ? getParenNotebook(parent)
          : [
              {
                id: parent.id,
                label: `${parent.emoji ? `${parent.emoji} ` : ""}${
                  parent.name
                }`,
                to: `/${parent.workspaceId}/notebooks/${parent.id}`,
              },
            ]),
      ];
    };
    if (notebook) return getParenNotebook(notebook).reverse();
    else return [];
  }, [allNotebooks, notebook]);

  const handleCreateNote = useCallback(async () => {
    if (!notebook) return;
    const note = await createNote({
      workspaceId: notebook.workspaceId,
      notebookId: notebook.id,
      content: newNoteDefaultContent,
    });
    navigate({
      to: `/${note.workspaceId}/notes/${note.id}`,
    });
  }, [createNote, notebook, navigate]);

  return (
    <div className="flex h-full w-full flex-col">
      <PageHeader broadCrumbs={broadCrumbs} activeId={notebookId}>
        <CreateNotebookDialog workspaceId={workspaceId} parentId={notebookId}>
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiFolderPlus />
          </button>
        </CreateNotebookDialog>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleCreateNote}
        >
          <FiFilePlus />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
      <div className="flex-1 overflow-y-auto">
        <NotesAndFoldersTable notes={notes} notebooks={notebooks} />
      </div>
    </div>
  );
}
