import { Outlet, useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../types/locationGenerics";
import FilesList from "../../components/files-list";
import useNotes from "../../store/useNotes";
import AllNotesHeader from "./all-notes-header";

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
          <div className="mx-auto max-w-4xl p-4">
            <FilesList notes={notes} showParentNotebook />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
