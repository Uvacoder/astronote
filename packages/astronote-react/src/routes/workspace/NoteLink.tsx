import { Link } from "@tanstack/react-location";
import clsx from "clsx";
import { useDrag } from "react-dnd";
import ContextMenu from "../../components/ContextMenu";
import NoteIcon from "../../components/NoteIcon";
import useNoteContextMenu from "../../hooks/useNoteContextMenu";
import useNotes from "../../store/useNotes";
import Note from "../../types/note";
import Notebook from "../../types/notebook";

export interface NoteLinkProps {
  note: Note;
  depth?: number;
}

export const NoteLink = (props: NoteLinkProps) => {
  const { note, depth } = props;
  const { getMenuItems: getItems } = useNoteContextMenu();
  const updateNote = useNotes((state) => state.updateNote);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "note",
    item: note,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<Notebook>();
      console.log({ item, dropResult });
      if (dropResult) {
        if (item.notebookId === dropResult.id) return;
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
  }));

  return (
    <ContextMenu items={getItems(note)}>
      <div
        ref={drag}
        className={clsx({
          "pointer-events-none opacity-50": isDragging,
        })}
      >
        <Link
          to={`notes/${note.id}`}
          className={clsx("flex items-center gap-3 rounded-md py-1 pl-3 pr-3")}
          getActiveProps={() => ({
            className: "bg-gray-100 dark:bg-gray-800",
          })}
          getInactiveProps={() => ({
            className:
              "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
          })}
          style={{
            paddingLeft:
              typeof depth !== "undefined" ? `${depth + 1.875}rem` : undefined,
          }}
        >
          <span className="flex h-5 w-5 items-center justify-center text-lg">
            <NoteIcon note={note} />
          </span>
          <p className="flex-1 truncate">{note.title || "Untitled"}</p>
        </Link>
      </div>
    </ContextMenu>
  );
};
