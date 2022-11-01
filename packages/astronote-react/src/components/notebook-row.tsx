import { Link } from "@tanstack/react-location";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import useNotebookContextMenu from "../hooks/useNotebookContextMenu";
import useNotebooks from "../store/useNotebooks";
import useNotes from "../store/useNotes";
import Notebook from "../types/notebook";
import getNotebookPath from "../utils/getNotebookPath";
import ContextMenu from "./context-menu";
import NotebookIcon from "./notebook-icon";

const NotebookRow = (props: { notebook: Notebook }) => {
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
        to={getNotebookPath(notebook)}
        className="grid grid-cols-5 items-center gap-4 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="col-span-3 flex items-center gap-4 text-sm">
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

export default NotebookRow;
