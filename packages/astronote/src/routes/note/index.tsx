import AstronoteEditor from "@astronote/editor";
import {
  useCommands,
  useHelpers,
  useKeymap,
  useRemirrorContext,
} from "@remirror/react";
import { useMatch } from "@tanstack/react-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { FiCopy, FiSidebar, FiStar } from "react-icons/fi";
import { MdStar, MdStarOutline } from "react-icons/md";
import { KeyBindingProps, updateMark } from "remirror";
import { getNoteAsync, updateNoteAsync } from "../../api/noteApi";
import { fetchAllNotebooks } from "../../api/notebookApi";
import PageHeader from "../../components/PageHeader";
import iBroadCrumb from "../../types/broadCrumb";
import { UpdateNoteInputs } from "../../types/forms";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";

const NotePage = () => {
  const {
    params: { workspaceId, noteId },
  } = useMatch<LocationGenerics>();

  const noteQuery = useQuery(["note", workspaceId, noteId], () =>
    getNoteAsync(workspaceId, noteId)
  );

  if (noteQuery.isLoading) return <div>Loading...</div>;

  if (noteQuery.isError) return <div>Error</div>;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AstronoteEditor
        placeholder="Start typing..."
        tags={["react", "astronote", "tauri", "javascript", "typescript"]}
        users={[
          {
            id: "rohid",
            label: "Rohidul Islam",
          },
        ]}
      >
        <NoteEditorHeader note={noteQuery.data} />
      </AstronoteEditor>
    </div>
  );
};

export default NotePage;

const NoteEditorHeader = ({ note }: { note: Note }) => {
  const helpers = useHelpers();
  const { setContent } = useRemirrorContext();

  const notebooksQuery = useQuery(["notebooks", note.workspaceId], () =>
    fetchAllNotebooks(note.workspaceId)
  );
  const queryClient = useQueryClient();
  const updateNoteMut = useMutation(updateNoteAsync);
  const { toggleCode } = useCommands();

  const handleUpdateNote = useCallback(
    async (value: UpdateNoteInputs) => {
      await updateNoteMut.mutateAsync({
        id: note.id,
        body: value,
      });
      queryClient.invalidateQueries(["note", note.workspaceId, note.id]);
      queryClient.invalidateQueries(["notes", note.workspaceId]);
    },
    [updateNoteMut, note, queryClient]
  );

  const broadCrumbs = useMemo(() => {
    const notebooks = notebooksQuery.data || [];
    const getParenNotebook = (file: Notebook | Note): iBroadCrumb[] => {
      const parent = notebooks.find((item) =>
        file._type === "note"
          ? item.id === file.notebookId
          : item.id === file.parentId
      );
      const linkPrefix = "../../";
      return [
        {
          id: file.id,
          label: `${
            file._type === "note" ? file.title || "Untitled" : file.name
          }`,
          to: `${linkPrefix}/${file._type === "note" ? "notes" : "notebooks"}/${
            file.id
          }`,
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
                to: `${linkPrefix}/notebooks/${parent.id}`,
              },
            ]),
      ];
    };

    return getParenNotebook(note).reverse();
  }, [notebooksQuery, note]);

  const handleSave = useCallback(
    ({ state }: KeyBindingProps) => {
      const content = helpers.getJSON(state);
      const docText = helpers.getText();
      const lines = docText.split(/\n/).filter(Boolean);
      const title = (lines[0] || "").trim().slice(0, 100);
      const description = lines.slice(1).join(" ").trim().slice(0, 300);
      handleUpdateNote({
        content,
        title,
        description,
      });
      return true;
    },
    [helpers, handleUpdateNote]
  );

  useKeymap("Mod-s", handleSave);
  useKeymap("Mod-/", toggleCode.original());

  useEffect(() => {
    setContent(note.content);
  }, [note.id, setContent]);

  return (
    <PageHeader broadCrumbs={broadCrumbs} activeId={note.id}>
      {updateNoteMut.isIdle
        ? "idle"
        : updateNoteMut.isError
        ? "Error"
        : updateNoteMut.isLoading
        ? "Loading..."
        : "Saved"}
      <button
        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md"
        onClick={() =>
          handleUpdateNote({
            isFavorite: !note.isFavorite,
          })
        }
      >
        {note.isFavorite ? <MdStar /> : <MdStarOutline />}
      </button>
      <button
        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md"
        onClick={() => {
          window.navigator.clipboard.writeText(helpers.getMarkdown());
        }}
      >
        <FiCopy />
      </button>
      <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
        <FiSidebar className="rotate-180" />
      </button>
    </PageHeader>
  );
};
