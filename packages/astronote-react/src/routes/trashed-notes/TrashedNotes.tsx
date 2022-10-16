import { Outlet, useMatch } from "@tanstack/react-location";
import FilesList from "../../components/files-list";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";
import TrashedNotesHeader from "./TrashedNotesHeader";

export default function TrashedNotes() {
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

  if (!workspaceId) return <div>Workspace Not Found</div>;

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TrashedNotesHeader workspaceId={workspaceId} />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-4">
            <FilesList notes={notes} />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
