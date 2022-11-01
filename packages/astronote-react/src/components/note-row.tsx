import { Link } from "@tanstack/react-location";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useDrag } from "react-dnd";
import { FiFolder } from "react-icons/fi";
import useNoteContextMenu from "../hooks/useNoteContextMenu";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import Note from "../types/note";
import Notebook from "../types/notebook";
import getNotePath from "../utils/getNotePath";
import ContextMenu from "./context-menu";
import NoteIcon from "./note-icon";

const NoteRow = ({
  note,
  showParentNotebook,
}: {
  note: Note;
  showParentNotebook?: boolean;
}) => {
  const { getMenuItems: getNoteMenuItems } = useNoteContextMenu();
  const updateNote = useNotes((state) => state.updateNote);
  const parentNotebook = useNotebooks((state) =>
    showParentNotebook
      ? state.notebooks.find((item) => item.id === note.notebookId)
      : null
  );
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "note",
      item: note,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<Notebook>();
        console.log({ item, dropResult });
        if (dropResult && item.notebookId !== dropResult.id) {
          updateNote(item.id, {
            notebookId: dropResult.id,
          });
        }
      },
      collect(monitor) {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [note]
  );

  return (
    <ContextMenu items={getNoteMenuItems(note)} key={note.id}>
      <div
        ref={drag}
        className={clsx({
          "pointer-events-none opacity-50": isDragging,
        })}
      >
        <Link
          to={getNotePath(note)}
          className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="col-span-3 flex items-center gap-4">
            <span className="text-2xl">
              <NoteIcon note={note} />
            </span>
            <div className="flex-1 overflow-hidden">
              <p className="truncate">{note.title || "Untitled"}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                {!!parentNotebook && (
                  <span className="flex items-center gap-1">
                    <FiFolder className="inline" />
                    {parentNotebook.name}
                  </span>
                )}
                <span className="flex-1 truncate font-light">
                  {note.description || "No Content"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="truncate text-sm text-gray-600 dark:text-gray-300">
              {formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div>
            <p className="truncate text-sm text-gray-600 dark:text-gray-300">
              {formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>
      </div>
    </ContextMenu>
  );
};

export default NoteRow;
