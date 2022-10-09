import { useMatch, useNavigate } from "@tanstack/react-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiFilePlus, FiFolderPlus, FiMoreHorizontal } from "react-icons/fi";
import { createNoteAsync, getAllNotesAsync } from "../../api/noteApi";
import { LocationGenerics } from "../../types/locationGenerics";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import PageHeader from "../../components/PageHeader";
import { useCallback, useMemo } from "react";
import newNoteDefaultContent from "../../data/newNoteDefaultContent";
import CreateNotebookDialog from "../../components/CreateNotebookDialog";

export default function AllNotesScreen() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allNotes = [] } = useQuery(["notes", workspaceId], () =>
    getAllNotesAsync(workspaceId)
  );

  const notes = useMemo(
    () => allNotes.filter((note) => !note.isDeleted),
    [allNotes]
  );

  const createNoteMut = useMutation(createNoteAsync);

  const handleCreateNote = useCallback(async () => {
    const note = await createNoteMut.mutateAsync({
      workspaceId,
      content: newNoteDefaultContent,
    });
    queryClient.invalidateQueries(["notes", workspaceId]);
    navigate({
      to: `../notes/${note.id}`,
    });
  }, [createNoteMut, workspaceId, navigate, queryClient]);

  return (
    <div className="flex h-full w-full flex-col">
      <PageHeader
        activeId="all"
        broadCrumbs={[
          {
            id: "all",
            to: "",
            label: "All Notes",
          },
        ]}
      >
        <CreateNotebookDialog workspaceId={workspaceId} linkPrefix="../">
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
        <NotesAndFoldersTable notes={notes} linkPrefix="../" />
      </div>
    </div>
  );
}
