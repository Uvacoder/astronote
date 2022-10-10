import { useMatch } from "@tanstack/react-location";
import { FiMoreHorizontal } from "react-icons/fi";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import PageHeader from "../../components/PageHeader";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";

export default function TrashScreen() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notes = useNotes((state) =>
    state.notes
      .filter((note) => note.workspaceId === workspaceId && note.isDeleted)
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );

  return (
    <div className="h-full w-full">
      <PageHeader
        activeId="trash"
        broadCrumbs={[
          {
            id: "trash",
            to: "",
            label: "Trash",
          },
        ]}
      >
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
