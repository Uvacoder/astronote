import { FC } from "react";
import SectionTitleBar from "../../components/section-title-bar";
import useNotes from "../../store/useNotes";
import Workspcae from "../../types/workspace";
import { NoteLink } from "./note-link";

interface PinnedNotesProps {
  workspaceId: string;
}

const PinnedNotes: FC<PinnedNotesProps> = (props) => {
  const { workspaceId } = props;
  const pinnedNotes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          !note.isDeleted && note.workspaceId === workspaceId && note.isPinned
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );

  if (pinnedNotes.length === 0) {
    return null;
  }

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Pinned" />
      <nav className="space-y-px px-2">
        {pinnedNotes.map((note) => (
          <NoteLink key={note.id} note={note} />
        ))}
      </nav>
    </section>
  );
};

export default PinnedNotes;
