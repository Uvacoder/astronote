import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useCallback } from "react";
import { updateNoteAsync } from "../../api/noteApi";
import { UpdateNoteInputs } from "../../types/forms";
import Note from "../../types/note";

import AstronoteEditor from "@astronote/editor";
import { useHelpers } from "@remirror/react";

export interface EditorProps {
  note: Note;
  workspaceId: string;
}
const Editor: FC<EditorProps> = (props) => {
  const { note, workspaceId } = props;
  const queryClient = useQueryClient();
  const updateNoteMut = useMutation(updateNoteAsync);

  const update = useCallback(
    async (value: UpdateNoteInputs) => {
      await updateNoteMut.mutateAsync({
        id: note.id,
        body: value,
      });
      queryClient.invalidateQueries(["note", workspaceId, note.id]);
      queryClient.invalidateQueries(["notes", workspaceId]);
    },
    [updateNoteMut, note]
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <AstronoteEditor
        placeholder="Start typing..."
        autoFocus
        stringHandler={"markdown"}
        initialContent={note.content}
        users={[
          {
            id: "1",
            label: "User 1",
          },
          {
            id: "2",
            label: "User 2",
          },
          {
            id: "3",
            label: "User 3",
          },
        ]}
      >
        <SaveButton />
      </AstronoteEditor>
    </div>
  );
};

export default Editor;

function SaveButton() {
  const { getJSON } = useHelpers();
  const handleClick = useCallback(
    () => alert(JSON.stringify(getJSON())),
    [getJSON]
  );

  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleClick}
    >
      Save
    </button>
  );
}
