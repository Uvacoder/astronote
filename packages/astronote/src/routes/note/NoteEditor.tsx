import AstronoteEditor from "@an/editor";
import {
  useCommands,
  useHelpers,
  useKeymap,
  useRemirrorContext,
} from "@remirror/react";
import { FC, useCallback, useEffect } from "react";
import { KeyBindingProps } from "remirror";
import newNoteDefaultContent from "../../data/newNoteDefaultContent";
import useNotes from "../../store/useNotes";
import Note from "../../types/note";

export interface NoteEditorProps {
  note: Note;
}

const NoteEditor: FC<NoteEditorProps> = ({ note }) => {
  return (
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
      <EditorActions note={note} />
    </AstronoteEditor>
  );
};

export default NoteEditor;

const EditorActions = ({ note }: { note: Note }) => {
  const helpers = useHelpers();
  const { setContent } = useRemirrorContext();
  const { toggleCode } = useCommands();
  const updateNote = useNotes((state) => state.updateNote);

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
  return null;
};
