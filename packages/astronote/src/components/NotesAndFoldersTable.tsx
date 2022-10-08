import { Link } from "@tanstack/react-location";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";
import Note from "../types/note";
import Notebook from "../types/notebook";
import NoteIcon from "./note-icon";
import NotebookIcon from "./notebook-icon";

export interface NotesAndFoldersTableProps {
  notes?: Note[];
  notebooks?: Notebook[];
  linkPrefix: string;
}

const NotesAndFoldersTable: FC<NotesAndFoldersTableProps> = (props) => {
  const { notes, notebooks, linkPrefix } = props;
  return (
    <div>
      <div className="px-8 grid grid-cols-5 gap-4 items-center h-8 border-b border-gray-100 dark:border-gray-800">
        <button className="col-span-3 text-left h-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 flex items-center gap-2">
          <p className="truncate flex-1">Name</p>
          <FiChevronDown />
        </button>
        <button className="col-span-1 text-left h-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 flex items-center gap-2">
          <p className="truncate flex-1">Updated</p>
          {/* <FiChevronDown /> */}
        </button>
        <button className="col-span-1 text-left h-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 flex items-center gap-2">
          <p className="truncate flex-1">Created</p>
          {/* <FiChevronDown /> */}
        </button>
      </div>
      <div className="p-4 space-y-4">
        {notebooks && notebooks.length > 0 && (
          <section>
            {notes && notes.length > 0 && (
              <div className="px-4 mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notebooks
                </p>
              </div>
            )}
            <nav>
              {notebooks.map((notebook) => (
                <Link
                  to={`${linkPrefix}/notebooks/${notebook.id}`}
                  key={notebook.id}
                  className="grid grid-cols-5 hover:bg-gray-100 dark:hover:bg-gray-800 items-center gap-4 px-4 py-2 rounded-md"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <span className="text-2xl">
                      <NotebookIcon notebook={notebook} />
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{notebook.name}</p>
                      <p className="text-sm font-light truncate text-gray-600 dark:text-gray-300">
                        0 items
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {formatDistanceToNow(new Date(notebook.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {formatDistanceToNow(new Date(notebook.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </nav>
          </section>
        )}
        {notes && notes.length > 0 && (
          <section>
            {notebooks && notebooks.length > 0 && (
              <div className="px-4 mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notes
                </p>
              </div>
            )}
            <nav>
              {notes?.map((note) => (
                <Link
                  to={`${linkPrefix}/notes/${note.id}`}
                  key={note.id}
                  className="grid grid-cols-5 hover:bg-gray-100 dark:hover:bg-gray-800 items-center gap-4 px-4 py-2 rounded-md"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <span className="text-2xl">
                      <NoteIcon note={note} />
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">
                        {note.title || "Untitled"}
                      </p>
                      <p className="text-sm font-light truncate text-gray-600 dark:text-gray-300">
                        {note.description || "No Content"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </nav>
          </section>
        )}
      </div>
    </div>
  );
};

export default NotesAndFoldersTable;
