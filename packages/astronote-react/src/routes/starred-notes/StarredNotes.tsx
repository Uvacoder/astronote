import { Outlet, useMatch } from "@tanstack/react-location";
import NotesAndFoldersTable from "../../components/NotesAndFoldersTable";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";
import StarredNotesHeader from "./StarredNotesHeader";

export default function StarredNotes() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          note.workspaceId === workspaceId && !note.isDeleted && note.isFavorite
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );

  if (!workspaceId) return <div>Workspace Not Found</div>;

  return (
    <>
      <div className="flex flex-1 flex-col">
        <StarredNotesHeader workspaceId={workspaceId} />
        <div className="flex-1 overflow-y-auto">
          <NotesAndFoldersTable notes={notes} showParentNotebook />
        </div>
      </div>
      <Outlet />
    </>
  );
}
