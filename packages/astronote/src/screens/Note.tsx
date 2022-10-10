import AstronoteEditor from "@astronote/editor";
import {
  useHelpers,
  useRemirrorContext,
  useCommands,
  useKeymap,
} from "@remirror/react";
import { useMatch } from "@tanstack/react-location";
import { useCallback, useMemo, useEffect } from "react";
import {
  MdMoreHoriz,
  MdOutlinePushPin,
  MdPushPin,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import { KeyBindingProps } from "remirror";
import PageHeader from "../components/PageHeader";
import newNoteDefaultContent from "../data/newNoteDefaultContent";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import iBroadCrumb from "../types/broadCrumb";
import { LocationGenerics } from "../types/locationGenerics";
import Note from "../types/note";
import Notebook from "../types/notebook";

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
    setSelectedNoteId(noteId);
    return () => {
      setSelectedNoteId(null);
    };
  }, [noteId, setSelectedNoteId]);

  return (
    <div className="flex h-full w-full flex-col">
      <AstronoteEditor
        autoFocus
        placeholder="Start typing..."
        tags={["react", "astronote", "tauri", "javascript", "typescript"]}
        users={[
          {
            id: "rohid",
            label: "Rohidul Islam",
          },
        ]}
      >
        <NoteEditorHeader note={note} />
      </AstronoteEditor>
    </div>
  );
}

const NoteEditorHeader = ({ note }: { note: Note }) => {
  const helpers = useHelpers();
  const { setContent } = useRemirrorContext();
  const notebooks = useNotebooks((state) =>
    state.notebooks.filter((item) => item.workspaceId === note.workspaceId)
  );
  const updateNote = useNotes((state) => state.updateNote);
  const { toggleCode } = useCommands();

  const broadCrumbs = useMemo((): iBroadCrumb[] => {
    const noteBroadCrumbItem = {
      id: note.id,
      label: `${note.title || "Untitled"}`,
      to: `/${note.workspaceId}/notes/${note.id}`,
    };

    if (note.isDeleted) {
      return [
        {
          id: "trash",
          label: "Trash",
          to: `/${note.workspaceId}/trash`,
        },
        noteBroadCrumbItem,
      ];
    }
    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = notebooks.find((item) => item.id === file.parentId);
      return [
        {
          id: file.id,
          label: `${file.emoji ? `${file.emoji} ` : ""}${file.name}`,
          to: `/${file.workspaceId}/notebooks/${file.id}`,
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
                to: `/${parent.workspaceId}/notebooks/${parent.id}`,
              },
            ]),
      ];
    };
    const parent = notebooks.find((item) => item.id === note.notebookId);
    if (!parent) {
      return [noteBroadCrumbItem];
    }
    return [noteBroadCrumbItem, ...getParenNotebook(parent)].reverse();
  }, [notebooks, note]);

  const handleSave = useCallback(
    ({ state }: KeyBindingProps) => {
      const content = helpers.getJSON(state);
      const docText = helpers.getText();
      const lines = docText.split(/\n/).filter(Boolean);
      const title = (lines[0] || "").trim().slice(0, 100);
      const description = lines.slice(1).join(" ").trim().slice(0, 300);
      updateNote(note.id, {
        content,
        title,
        description,
      });
      return true;
    },
    [helpers, updateNote, note]
  );

  useKeymap("Mod-s", handleSave);
  useKeymap("Mod-/", toggleCode.original());

  useEffect(() => {
    setContent(note.content || newNoteDefaultContent);
  }, [note.id, setContent]);

  return (
    <PageHeader broadCrumbs={broadCrumbs} activeId={note.id}>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() =>
          updateNote(note.id, {
            isPinned: !note.isPinned,
          })
        }
      >
        {note.isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
      </button>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() =>
          updateNote(note.id, {
            isFavorite: !note.isFavorite,
          })
        }
      >
        {note.isFavorite ? <MdStar /> : <MdStarOutline />}
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
        <MdMoreHoriz className="rotate-180" />
      </button>
    </PageHeader>
  );
};
