import { useMatch, useNavigate } from "@tanstack/react-location";
import { useCallback } from "react";
import { FiMoreHorizontal, FiFilePlus } from "react-icons/fi";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import PageHeader from "../../components/PageHeader";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";

export default function UnsortedScreen() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          note.workspaceId === workspaceId &&
          !note.isDeleted &&
          !note.notebookId
      )
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
      to: `/${note.workspaceId}/notes/${note.id}`,
    });
  }, [createNote, workspaceId, navigate]);

  return (
    <div className="h-full w-full">
      <PageHeader
        activeId="unsorted"
        broadCrumbs={[
          {
            id: "unsorted",
            to: "",
            label: "Unsorted",
          },
        ]}
      >
        <button
          onClick={handleCreateNote}
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiFilePlus />
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
