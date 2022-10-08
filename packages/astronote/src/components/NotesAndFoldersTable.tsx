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
      <div className="grid h-8 grid-cols-5 items-center gap-4 border-b border-gray-100 px-8 dark:border-gray-800">
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
                <Link
                  to={`${linkPrefix}/notebooks/${notebook.id}`}
                  key={notebook.id}
                  className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <span className="text-2xl">
                      <NotebookIcon notebook={notebook} />
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{notebook.name}</p>
                      <p className="truncate text-sm font-light text-gray-600 dark:text-gray-300">
                        0 items
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
                <Link
                  to={`${linkPrefix}/notes/${note.id}`}
                  key={note.id}
                  className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <span className="text-2xl">
                      <NoteIcon note={note} />
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">
                        {note.title || "Untitled"}
                      </p>
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
              ))}
            </nav>
          </section>
        )}
      </div>
    </div>
  );
};

export default NotesAndFoldersTable;