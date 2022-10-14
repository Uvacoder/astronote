import { useMatch, useNavigate } from "@tanstack/react-location";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { LocationGenerics } from "../../types/locationGenerics";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import PageHeader from "../../components/PageHeader";
import { useCallback } from "react";
import useNotes from "../../store/useNotes";

export default function AllNotesScreen() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notes = useNotes((state) =>
    state.notes
      .filter((note) => note.workspaceId === workspaceId && !note.isDeleted)
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );
  const createNote = useNotes((state) => state.createNote);

  const navigate = useNavigate();

  const handleCreateNote = useCallback(async () => {
    const note = await createNote({
      workspaceId,
    });
    navigate({
      to: `/workspaces/${note.workspaceId}/notes/${note.id}`,
    });
  }, [createNote, workspaceId, navigate]);

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
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleCreateNote}
        >
          <FiPlus />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
      <div className="flex-1 overflow-y-auto">
        <NotesAndFoldersTable notes={notes} />
      </div>
    </div>
  );
}
