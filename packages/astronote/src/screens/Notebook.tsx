import { useMatch, useNavigate } from "@tanstack/react-location";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { FiFolderPlus, FiFilePlus, FiMoreHorizontal } from "react-icons/fi";
import { createNoteAsync } from "../api/noteApi";
import CreateNotebookDialog from "../components/CreateNotebookDialog";
import NotesAndFoldersTable from "../components/NotesAndFoldersTable";
import PageHeader from "../components/PageHeader";
import newNoteDefaultContent from "../data/newNoteDefaultContent";
import useNotebooksQuery from "../hooks/useNotebooksQuery";
import useNotesQuery from "../hooks/useNotesQuery";
import iBroadCrumb from "../types/broadCrumb";
import { LocationGenerics } from "../types/locationGenerics";
import Notebook from "../types/notebook";

export default function NotebookScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    params: { workspaceId, notebookId },
  } = useMatch<LocationGenerics>();
  const { data: allNotebooks = [] } = useNotebooksQuery();
  const { data: allNotes = [] } = useNotesQuery();
  const createNoteMut = useMutation(createNoteAsync);

  const notebook = useMemo(
    () => allNotebooks.find((item) => item.id === notebookId),
    [allNotebooks, notebookId]
  );

  const broadCrumbs = useMemo(() => {
    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = allNotebooks.find((item) => item.id === file.parentId);
      return [
        {
          id: file.id,
          label: `${file.emoji ? `${file.emoji} ` : ""}${file.name}`,
          to: `../../notebooks/${file.id}`,
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
                to: `../../notebooks/${parent.id}`,
              },
            ]),
      ];
    };
    if (notebook) return getParenNotebook(notebook).reverse();
    else return [];
  }, [allNotebooks, notebook]);

  const notes = useMemo(
    () => allNotes.filter((note) => note.notebookId === notebookId),
    [notebookId, allNotes]
  );
  const notebooks = useMemo(
    () => allNotebooks.filter((note) => note.parentId === notebookId),
    [notebookId, allNotebooks]
  );

  const handleCreateNote = useCallback(async () => {
    if (!notebook) return;
    const note = await createNoteMut.mutateAsync({
      workspaceId: notebook?.workspaceId,
      notebookId: notebook?.id,
      content: newNoteDefaultContent,
    });
    queryClient.invalidateQueries(["notes", workspaceId]);
    navigate({
      to: `../../notes/${note.id}`,
      replace: true,
    });
  }, [createNoteMut, notebook, navigate, queryClient]);

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
        <NotesAndFoldersTable
          notes={notes}
          notebooks={notebooks}
          linkPrefix="../../"
        />
      </div>
    </div>
  );
}
