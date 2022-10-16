import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";
import Note from "../types/note";
import Notebook from "../types/notebook";
import NoteRow from "./note-row";
import NotebookRow from "./notebook-row";

export interface FilesListProps {
  notes?: Note[];
  notebooks?: Notebook[];
  showParentNotebook?: boolean;
}

const FilesList: FC<FilesListProps> = (props) => {
  const { notes, notebooks, showParentNotebook } = props;

  return (
    <div>
      <div className="sticky top-0 mb-4 grid h-8 grid-cols-5 items-center gap-4 border-b border-gray-100 bg-white px-8 dark:border-gray-800 dark:bg-gray-900">
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
      <div className="space-y-4">
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
                <NotebookRow key={notebook.id} notebook={notebook} />
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
                <NoteRow
                  key={note.id}
                  note={note}
                  showParentNotebook={showParentNotebook}
                />
              ))}
            </nav>
          </section>
        )}
      </div>
    </div>
  );
};

export default FilesList;
