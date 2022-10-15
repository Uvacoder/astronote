import { Outlet, useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../types/locationGenerics";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import useNotes from "../../store/useNotes";
import AllNotesHeader from "./AllNotesHeader";

export default function AllNotes() {
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

  if (!workspaceId) return <div>No Workspace found</div>;

  return (
    <>
      <div className="flex flex-1 flex-col">
        <AllNotesHeader workspaceId={workspaceId} />
        <div className="flex-1 overflow-y-auto">
          <NotesAndFoldersTable notes={notes} showParentNotebook />
        </div>
      </div>
      <Outlet />
    </>
  );
}
