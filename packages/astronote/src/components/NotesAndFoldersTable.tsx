import { Link } from "@tanstack/react-location";
import { formatDistanceToNow } from "date-fns";
import { FC, useCallback, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import Note from "../types/note";
import Notebook from "../types/notebook";
import NoteIcon from "./NoteIcon";
import NotebookIcon from "./NotebookIcon";
import ContextMenu from "./ContextMenu";
import useNotebookContextMenu from "../hooks/useNotebookContextMenu";
import useNoteContextMenu from "../hooks/useNoteContextMenu";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import { useDrag } from "react-dnd";
import clsx from "clsx";

export interface NotesAndFoldersTableProps {
  notes?: Note[];
  notebooks?: Notebook[];
}

const NotesAndFoldersTable: FC<NotesAndFoldersTableProps> = (props) => {
  const { notes, notebooks } = props;

  return (
    <div>
      <div className="sticky top-0 grid h-8 grid-cols-5 items-center gap-4 border-b border-gray-100 bg-white px-8 dark:border-gray-800 dark:bg-gray-900">
        <button className="col-span-3 flex h-full items-center gap-2 text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
          <p className="flex-1 truncate">Name</p>
          <FiChevronDown />
        </button>
        <button className="col-span-1 flex h-full items-center gap-2 text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
          <p className="flex-1 truncate">Updated</p>
          {/* <FiChevronDown /> */}
        </button>
        <button className="col-span-1 flex h-full items-center gap-2 text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
          <p className="flex-1 truncate">Created</p>
          {/* <FiChevronDown /> */}
        </button>
      </div>
      <div className="space-y-4 p-4">
        {notebooks && notebooks.length > 0 && (
          <section>
            {notes && notes.length > 0 && (
              <div className="mb-2 px-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notebooks
                </p>
              </div>
            )}
            <nav>
              {notebooks.map((notebook) => (
                <NotebookItem key={notebook.id} notebook={notebook} />
              ))}
            </nav>
          </section>
        )}
        {notes && notes.length > 0 && (
          <section>
            {notebooks && notebooks.length > 0 && (
              <div className="mb-2 px-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notes
                </p>
              </div>
            )}
            <nav>
              {notes?.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
            </nav>
          </section>
        )}
      </div>
    </div>
  );
};

export default NotesAndFoldersTable;

const NotebookItem = (props: { notebook: Notebook }) => {
  const { notebook } = props;
  const { getItems: getNotebookMenuItems } = useNotebookContextMenu();
  const allNotebooks = useNotebooks((state) => state.notebooks);
  const allNotes = useNotes((state) => state.notes);

  const childCount = useMemo(() => {
    return [
      ...allNotebooks.filter((item) => item.parentId === notebook.id),
      ...allNotes.filter(
        (item) => !item.isDeleted && item.notebookId === notebook.id
      ),
    ].length;
  }, [allNotebooks, allNotes, notebook]);

  return (
    <ContextMenu items={getNotebookMenuItems(notebook)} key={notebook.id}>
      <Link
        to={`/${notebook.workspaceId}/notebooks/${notebook.id}`}
        className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="col-span-3 flex items-center gap-4">
          <span className="text-2xl">
            <NotebookIcon notebook={notebook} />
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="truncate">{notebook.name}</p>
            <p className="truncate text-sm font-light text-gray-600 dark:text-gray-300">
              {childCount} items
            </p>
          </div>
        </div>
        <div>
          <p className="truncate text-sm text-gray-600 dark:text-gray-300">
            {formatDistanceToNow(new Date(notebook.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div>
          <p className="truncate text-sm text-gray-600 dark:text-gray-300">
            {formatDistanceToNow(new Date(notebook.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </Link>
    </ContextMenu>
  );
};

const NoteItem = ({ note }: { note: Note }) => {
  const { getMenuItems: getNoteMenuItems } = useNoteContextMenu();
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
    <ContextMenu items={getNoteMenuItems(note)} key={note.id}>
      <div
        ref={drag}
        className={clsx({
          "pointer-events-none opacity-50": isDragging,
        })}
      >
        <Link
          to={`/${note.workspaceId}/notes/${note.id}`}
          className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="col-span-3 flex items-center gap-4">
            <span className="text-2xl">
              <NoteIcon note={note} />
            </span>
            <div className="flex-1 overflow-hidden">
              <p className="truncate">{note.title || "Untitled"}</p>
              <p className="truncate text-sm font-light text-gray-600 dark:text-gray-300">
                {note.description || "No Content"}
              </p>
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
