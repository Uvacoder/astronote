import { FC, useCallback, useMemo } from "react";
import {
  MdMoreVert,
  MdOutlinePushPin,
  MdPushPin,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import IconButton from "../../components/common/button/icon-button";
import PageHeader from "../../components/page-header";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import iBroadCrumb from "../../types/broadCrumb";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import getNotebookPath from "../../utils/getNotebookPath";
import getNotePath from "../../utils/getNotePath";

interface NoteHeaderProps {
  note: Note;
}

const NoteHeader: FC<NoteHeaderProps> = ({ note }) => {
  const updateNote = useNotes((state) => state.updateNote);
  const allNotebooks = useNotebooks((state) =>
    state.notebooks.filter((item) => item.workspaceId === note.workspaceId)
  );

  const broadCrumbs = useMemo((): iBroadCrumb[] => {
    const noteBroadCrumbItem = {
      id: note.id,
      label: `${note.title || "Untitled"}`,
      to: getNotePath(note),
    };

    if (note.isDeleted) {
      return [
        {
          id: "trash",
          label: "Trash",
          to: `/workspaces/${note.workspaceId}/trash`,
        },
        noteBroadCrumbItem,
      ];
    }

    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = allNotebooks.find((item) => item.id === file.parentId);
      return [
        {
          id: file.id,
          label: `${file.emoji ? `${file.emoji} ` : ""}${file.name}`,
          to: getNotebookPath(file),
        },
        ...(!parent
          ? []
          : parent.parentId
          ? getParenNotebook(parent)
          : [
              {
                id: parent.id,
                label: `${parent.emoji ? `${parent.emoji} ` : ""}${
                  parent.name
                }`,
                to: getNotebookPath(parent),
              },
            ]),
      ];
    };
    const parent = allNotebooks.find((item) => item.id === note.notebookId);
    if (!parent) {
      return [noteBroadCrumbItem];
    }
    return [noteBroadCrumbItem, ...getParenNotebook(parent)].reverse();
  }, [allNotebooks, note]);

  const handleToggleFavorite = useCallback(() => {
    updateNote(note.id, {
      isFavorite: !note.isFavorite,
    });
  }, [updateNote, note]);

  const handleTogglePinned = useCallback(() => {
    updateNote(note.id, {
      isPinned: !note.isPinned,
    });
  }, [updateNote, note]);

  return (
    <PageHeader broadCrumbs={broadCrumbs} activeId={note.id}>
      <IconButton onClick={handleTogglePinned}>
        {note.isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
      </IconButton>
      <IconButton onClick={handleToggleFavorite}>
        {note.isFavorite ? <MdStar /> : <MdStarOutline />}
      </IconButton>
      <IconButton>
        <MdMoreVert />
      </IconButton>
    </PageHeader>
  );
};

export default NoteHeader;
