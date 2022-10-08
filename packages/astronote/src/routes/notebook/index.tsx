import { useMatch, useNavigate } from "@tanstack/react-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { FiMoreHorizontal, FiFolderPlus, FiFilePlus } from "react-icons/fi";
import { createNoteAsync, getAllNotesAsync } from "../../api/noteApi";
import { fetchAllNotebooks } from "../../api/notebookApi";
import CreateNotebookDialog from "../../components/CreateNotebookDialog";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import PageHeader from "../../components/PageHeader";
import newNoteDefaultContent from "../../data/newNoteDefaultContent";
import iBroadCrumb from "../../types/broadCrumb";
import { LocationGenerics } from "../../types/locationGenerics";
import Notebook from "../../types/notebook";

const NotebookPage = () => {
  const {
    params: { workspaceId, notebookId },
  } = useMatch<LocationGenerics>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const notebooksQuery = useQuery(["notebooks", workspaceId], () =>
    fetchAllNotebooks(workspaceId)
  );

  const notesQuery = useQuery(["notes", workspaceId], () =>
    getAllNotesAsync(workspaceId)
  );

  const createNoteMut = useMutation(createNoteAsync);

  const broadCrumbs = useMemo(() => {
    const notebooks = notebooksQuery.data || [];
    const notebook = notebooksQuery.data?.find(
      (item) => item.id === notebookId
    );

    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = notebooks.find((item) => item.id === file.parentId);
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
  }, [notebooksQuery, notebookId]);

  const notes = useMemo(
    () => notesQuery.data?.filter((note) => note.notebookId === notebookId),
    [notebookId, notesQuery]
  );

  const notebooks = useMemo(
    () => notebooksQuery.data?.filter((note) => note.parentId === notebookId),
    [notebookId, notebooksQuery]
  );

  const handleCreateNote = useCallback(async () => {
    const note = await createNoteMut.mutateAsync({
      workspaceId,
      notebookId,
      content: newNoteDefaultContent,
    });
    queryClient.invalidateQueries(["notes", workspaceId]);
    navigate({
      to: `../../notes/${note.id}`,
      replace: true,
    });
  }, [createNoteMut, workspaceId, notebookId, navigate, queryClient]);

  return (
    <div className="flex-1">
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
      <NotesAndFoldersTable
        notes={notes}
        notebooks={notebooks}
        linkPrefix="../../"
      />
    </div>
  );
};

export default NotebookPage;
