import { Outlet, useMatch } from "@tanstack/react-location";
import { useEffect } from "react";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";
import NoteEditor from "./NoteEditor";
import NoteHeader from "./NoteHeader";

export default function NoteScreen() {
  const {
    params: { workspaceId, noteId },
  } = useMatch<LocationGenerics>();
  const note = useNotes((state) =>
    state.notes.find(
      (item) => item.workspaceId === workspaceId && item.id === noteId
    )
  );
  const setSelectedNoteId = useNotes((state) => state.setSelectedId);

  if (!note) {
    return <div>Note not found!</div>;
  }

  useEffect(() => {
    if (!noteId) return;
    setSelectedNoteId(noteId);
    return () => {
      setSelectedNoteId(null);
    };
  }, [noteId, setSelectedNoteId]);

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <NoteHeader note={note} />
        <NoteEditor note={note} />
      </div>
      <Outlet />
    </>
  );
}
