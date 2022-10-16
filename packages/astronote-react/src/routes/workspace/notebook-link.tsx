import { useMatch, Link } from "@tanstack/react-location";
import clsx from "clsx";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import ContextMenu from "../../components/context-menu";
import NotebookIcon from "../../components/notebook-icon";
import useNotebookContextMenu from "../../hooks/useNotebookContextMenu";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import { NoteLink } from "./note-link";

export interface NotebookLinkProps {
  notebook: Notebook;
  depth?: number;
}

export const NotebookLink = (props: NotebookLinkProps) => {
  const { notebook, depth = 0 } = props;
  const [expand, setExpand] = useState(false);
  const { getItems } = useNotebookContextMenu();
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const selectedNotebook = useNotebooks((state) =>
    state.notebooks.find((item) => item.id === state.selectedId)
  );
  const selectedNote = useNotes((state) =>
    state.notes.find((item) => item.id === state.selectedId)
  );
  const updateNotebook = useNotebooks((state) => state.updateNotebook);
  const notes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          note.workspaceId === workspaceId &&
          !note.isDeleted &&
          note.notebookId === notebook.id
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );
  const notebooks = useNotebooks((state) =>
    state.notebooks
      .filter(
        (item) =>
          item.workspaceId === workspaceId && item.parentId === notebook.id
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  );
  const childCount = useMemo(
    () => [...notebooks, ...notes].length,
    [notebooks, notes]
  );

  const allNotebooks = useNotebooks((state) => state.notebooks);

  const getNotebookParentId = useCallback(
    (id: string): string[] => {
      const notebook = allNotebooks.find((item) => item.id === id);
      if (!notebook) return [];
      if (!notebook.parentId) return [notebook.id];
      return [
        notebook.id,
        notebook.parentId,
        ...getNotebookParentId(notebook.parentId),
      ];
    },
    [allNotebooks]
  );

  const isThisNoteMyChild = useCallback(
    (selNote: Note) => {
      if (!selNote.notebookId) return false;
      const parentIds = getNotebookParentId(selNote.notebookId);
      return parentIds.includes(notebook.id);
    },
    [notebook, allNotebooks, getNotebookParentId]
  );
  const isThisNotebookMyChild = useCallback(
    (selNotebook: Notebook) => {
      if (!selNotebook.parentId) return false;
      const parentIds = getNotebookParentId(selNotebook.parentId);
      return parentIds.includes(notebook.id);
    },
    [notebook, allNotebooks, getNotebookParentId]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["note", "notebook"],
      drop: () => notebook,
      collect(monitor) {
        return {
          isOver: monitor.isOver(),
        };
      },
    }),
    [notebook]
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "notebook",
      item: notebook,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<Notebook>();
        if (dropResult && item.parentId !== dropResult.id) {
          updateNotebook(item.id, {
            parentId: dropResult.id,
          });
        }
      },
      collect(monitor) {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [notebook, updateNotebook]
  );

  useEffect(() => {
    if (selectedNote && isThisNoteMyChild(selectedNote)) {
      setExpand(true);
    }
    if (selectedNotebook && isThisNotebookMyChild(selectedNotebook)) {
      setExpand(true);
    }
  }, [
    selectedNote,
    selectedNotebook,
    isThisNoteMyChild,
    isThisNotebookMyChild,
  ]);

  return (
    <>
      <div className="relative">
        <ContextMenu items={getItems(notebook)}>
          <div
            ref={drop}
            className={clsx({
              "pointer-events-none opacity-50": isDragging,
            })}
          >
            <div
              ref={drag}
              className={clsx({
                "ring-primary-500 pointer-events-none rounded-md ring-2":
                  isOver,
              })}
            >
              <Link
                to={`notebooks/${notebook.id}`}
                className={clsx(
                  "group flex cursor-default select-none items-center gap-3 rounded-md py-1 pl-8 pr-3"
                )}
                getActiveProps={() => ({
                  className: "bg-gray-100 dark:bg-gray-800",
                })}
                getInactiveProps={() => ({
                  className:
                    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
                })}
                style={{
                  paddingLeft: `${depth + 1.875}rem`,
                }}
              >
                <span className="flex h-5 w-5 items-center justify-center text-lg">
                  <NotebookIcon notebook={notebook} />
                </span>
                <p className="flex-1 truncate">{notebook.name}</p>
                {childCount > 0 && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {childCount}
                  </p>
                )}
              </Link>
            </div>
          </div>
        </ContextMenu>
        {childCount > 0 && (
          <button
            className="absolute top-1/2 flex h-full w-5 -translate-y-1/2 cursor-default items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={() => setExpand((value) => !value)}
            style={{
              left: `${depth + 0.5}rem`,
            }}
          >
            {expand ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        )}
      </div>

      <nav
        className={clsx("relative space-y-px pt-px", {
          block: expand,
          hidden: !expand,
          "pointer-events-none": isDragging,
        })}
      >
        {notebooks.map((item) => (
          <NotebookLink key={item.id} notebook={item} depth={depth + 1} />
        ))}
        {notes.map((item) => (
          <NoteLink key={item.id} note={item} depth={depth + 1} />
        ))}
        <div
          className="group absolute top-0 bottom-0 z-10 flex w-2 cursor-pointer justify-center"
          onClick={() => setExpand((value) => !value)}
          style={{
            left: `calc(${depth + 1.125}rem - 0.25rem)`,
          }}
        >
          <div className="h-full w-px bg-gray-200 group-hover:bg-gray-900 dark:bg-gray-700 dark:group-hover:bg-gray-50"></div>
        </div>
      </nav>
    </>
  );
};
