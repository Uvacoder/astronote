import { useMatch, useNavigate } from "@tanstack/react-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { createNoteAsync, getAllNotesAsync } from "../api/noteApi";
import { LocationGenerics } from "../types/locationGenerics";
import NotesAndFoldersTable from "../components/NotesAndFoldersTable";
import PageHeader from "../components/PageHeader";
import { useCallback } from "react";
import newNoteDefaultContent from "../data/newNoteDefaultContent";

const WorkspaceHome = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const notesQuery = useQuery(["notes", workspaceId], () =>
    getAllNotesAsync(workspaceId)
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
      replace: true,
    });
  }, [createNoteMut, workspaceId, navigate, queryClient]);

  return (
    <div className="flex-1 flex flex-col">
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
        <button
          className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md"
          onClick={handleCreateNote}
        >
          <FiPlus />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
      <div className="flex-1 overflow-y-auto pb-32">
        <NotesAndFoldersTable notes={notesQuery.data} linkPrefix="../" />
      </div>
    </div>
  );
};

export default WorkspaceHome;