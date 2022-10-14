import { Link, useMatch, useNavigate } from "@tanstack/react-location";
import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiList,
  FiStar,
  FiTrash,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiInbox,
  FiEdit,
  FiPlus,
} from "react-icons/fi";
import CreateOrUpdateNotebookDialog from "../../components/CreateOrUpdateNotebookDialog";
import NoteIcon from "../../components/NoteIcon";
import NotebookIcon from "../../components/NotebookIcon";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import ContextMenu from "../../components/ContextMenu";
import useNoteContextMenu from "../../hooks/useNoteContextMenu";
import useNotebookContextMenu from "../../hooks/useNotebookContextMenu";
import useWroksapces from "../../store/useWorkspaces";
import useNotes from "../../store/useNotes";
import useNotebooks from "../../store/useNotebooks";
import clsx from "clsx";
import { useDialogs } from "../../contexts/dialogContext";
import { useDrag, useDrop } from "react-dnd";

const mainMenu = [
  {
    to: "all",
    label: "All Notes",
    icon: <FiList />,
  },
  {
    to: "unsorted",
    label: "Unsorted",
    icon: <FiInbox />,
  },
  {
    to: "starred",
    label: "Starred",
    icon: <FiStar />,
  },
  {
    to: "trash",
    label: "Trash",
    icon: <FiTrash />,
  },
];

export default function WorkspaceSidebar() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const worksapce = useWroksapces((state) =>
    state.workspaces.find((item) => item.id === workspaceId)
  );
  const createNote = useNotes((state) => state.createNote);
  const navigate = useNavigate();

  if (!worksapce) {
    return <div>Workspace not found</div>;
  }

  const handleCreateQucikNote = useCallback(async () => {
    const note = await createNote({
      workspaceId,
    });
    navigate({
      to: `/workspaces/${workspaceId}/notes/${note.id}`,
    });
  }, [createNote, workspaceId]);

  return (
    <aside className="workspace-sidebar h-full w-72 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
      <header className="sticky top-0 z-20 flex h-12 w-full items-center gap-2 bg-white px-4 dark:bg-gray-900">
        <div className="flex flex-1 items-center">
          {/* {worksapce.emoji && (
            <span className="mr-2 text-xl">{worksapce.emoji}</span>
          )}
          <p className="flex-1">{worksapce.name}</p> */}
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiSettings />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleCreateQucikNote}
        >
          <FiEdit />
        </button>
      </header>

      <div className="space-y-8 pt-4 pb-16">
        <nav className="space-y-px px-2">
          {mainMenu.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="flex items-center gap-3 rounded-md px-3 py-1.5 "
              getActiveProps={() => ({
                className: "bg-gray-100 dark:bg-gray-800",
              })}
              getInactiveProps={() => ({
                className:
                  "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
              })}
            >
              <span className="flex h-6 w-6 items-center justify-center text-xl">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <PinnedNotes />
        <Notebooks />
      </div>
    </aside>
  );
}

const SectionTitleBar: FC<PropsWithChildren<{ title: string }>> = (props) => {
  return (
    <div className="mb-2 flex items-center gap-2 px-4">
      <p className="flex-1 truncate text-gray-500 dark:text-gray-400">
        {props.title}
      </p>
      {props.children}
    </div>
  );
};

const PinnedNotes = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const pinnedNotes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          !note.isDeleted && note.workspaceId === workspaceId && note.isPinned
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );

  if (pinnedNotes.length === 0) {
    return null;
  }

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Pinned" />
      <nav className="space-y-px px-2">
        {pinnedNotes.map((note) => (
          <NoteLink note={note} />
        ))}
      </nav>
    </section>
  );
};

const Notebooks = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notebooks = useNotebooks((state) =>
    state.notebooks
      .filter((item) => item.workspaceId === workspaceId && !item.parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
  );
  const dialog = useDialogs();
  const handleCreateNotebook = useCallback(() => {
    dialog.showDialog({
      title: "Create Notebook",
      content: (
        <CreateOrUpdateNotebookDialog type="create" workspaceId={workspaceId} />
      ),
    });
  }, [dialog, workspaceId]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["note", "notebook"],
    drop: () => ({
      id: null,
      name: "Unsorted",
    }),
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Notebooks">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleCreateNotebook}
        >
          <FiPlus />
        </button>
      </SectionTitleBar>

      <nav className="space-y-px px-2">
        {notebooks.length ? (
          notebooks.map((item) => (
            <NotebookLink key={item.id} notebook={item} depth={0} />
          ))
        ) : (
          <div className="px-2">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Use <b>Notebooks</b> to organize <b>Notes</b>
            </p>
          </div>
        )}
        <div
          className={clsx("relative h-[2px] w-full", {
            "bg-blue-500": isOver,
          })}
        >
          <div ref={drop} className="absolute left-0 right-0 -top-2 h-4"></div>
        </div>
      </nav>
    </section>
  );
};

export interface NotebookLinkProps {
  notebook: Notebook;
  depth?: number;
}

const NotebookLink = (props: NotebookLinkProps) => {
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

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["note", "notebook"],
    drop: () => notebook,
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "notebook",
    item: notebook,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<Notebook>();
      console.log({ item, dropResult });
      if (dropResult) {
        if (item.parentId === dropResult.id) return;
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
  }));

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
                "pointer-events-none rounded-md ring-2 ring-indigo-500": isOver,
              })}
            >
              <Link
                to={`notebooks/${notebook.id}`}
                className={clsx(
                  "group flex select-none items-center gap-3 rounded-md py-1 pl-8 pr-3"
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
            className="absolute top-1/2 flex h-full w-5 -translate-y-1/2 items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
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
        className={clsx("relative space-y-px", {
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

export interface NoteLinkProps {
  note: Note;
  depth?: number;
}

const NoteLink = (props: NoteLinkProps) => {
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
