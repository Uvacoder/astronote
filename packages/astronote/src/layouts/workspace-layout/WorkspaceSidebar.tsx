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
  FiFolderPlus,
  FiFilePlus,
} from "react-icons/fi";
import CreateNotebookDialog from "../../components/CreateNotebookDialog";
import NoteIcon from "../../components/NoteIcon";
import NotebookIcon from "../../components/NotebookIcon";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import ContextMenu from "../../components/ContextMenu";
import useNoteContextMenu from "../../hooks/useNoteContextMenu";
import useNotebookContextMenu from "../../hooks/useNotebookContextMenu";
import newNoteDefaultContent from "../../data/newNoteDefaultContent";
import useWroksapces from "../../store/useWorkspaces";
import useNotes from "../../store/useNotes";
import useNotebooks from "../../store/useNotebooks";
import clsx from "clsx";

const mainMenu = [
  {
    to: "all",
    label: "All Notes",
    icon: <FiList />,
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

  if (!worksapce) {
    return <div>Workspace not found</div>;
  }

  return (
    <aside className="workspace-sidebar h-full w-72 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
      <header className="sticky top-0 flex h-12 w-full items-center bg-white px-4 dark:bg-gray-900">
        <div className="flex flex-1 items-center">
          {worksapce.emoji && (
            <span className="mr-2 text-xl">{worksapce.emoji}</span>
          )}
          <p className="flex-1">{worksapce.name}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiSettings />
        </button>
      </header>

      <div className="space-y-8 py-4">
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
    state.notes.filter(
      (note) =>
        !note.isDeleted && note.workspaceId === workspaceId && note.isPinned
    )
  );

  if (pinnedNotes.length === 0) {
    return null;
  }

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Pinned" />
      <nav className="px-2">
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
  const notes = useNotes((state) =>
    state.notes
      .filter(
        (note) =>
          note.workspaceId === workspaceId &&
          !note.isDeleted &&
          !note.notebookId
      )
      .sort((a, b) =>
        (a.title || "Untitled").localeCompare(b.title || "Untitled")
      )
  );
  const notebooks = useNotebooks((state) =>
    state.notebooks
      .filter((item) => item.workspaceId === workspaceId && !item.parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
  );
  const createNote = useNotes((state) => state.createNote);
  const navigate = useNavigate();

  const handleCreateNote = useCallback(async () => {
    const note = await createNote({
      workspaceId,
      content: newNoteDefaultContent,
    });
    navigate({
      to: `/${note.workspaceId}/notes/${note.id}`,
    });
  }, [createNote, navigate]);

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Notebooks">
        <CreateNotebookDialog workspaceId={workspaceId}>
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiFolderPlus />
          </button>
        </CreateNotebookDialog>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleCreateNote}
        >
          <FiFilePlus />
        </button>
      </SectionTitleBar>

      <nav className="space-y-px px-2">
        {notebooks.map((item) => (
          <NotebookLink key={item.id} notebook={item} depth={0} />
        ))}
        {notes.map((item) => (
          <NoteLink key={item.id} note={item} depth={0} />
        ))}
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
          <Link
            to={`notebooks/${notebook.id}`}
            className="group flex select-none items-center gap-3 rounded-md py-1.5 pl-8 pr-3"
            getActiveProps={() => ({
              className: "bg-gray-100 dark:bg-gray-800",
            })}
            getInactiveProps={() => ({
              className:
                "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
            })}
            style={{
              paddingLeft: `${(depth + 1.5) * 1}rem`,
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
        </ContextMenu>
        {childCount > 0 && (
          <button
            className="absolute top-1/2 -translate-y-1/2"
            onClick={() => setExpand((value) => !value)}
            style={{
              left: `${(depth + 0.375) * 1}rem`,
            }}
          >
            {expand ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        )}
      </div>

      <nav
        className={clsx("space-y-px", {
          block: expand,
          hidden: !expand,
        })}
      >
        {notebooks.map((item) => (
          <NotebookLink key={item.id} notebook={item} depth={depth + 1} />
        ))}
        {notes.map((item) => (
          <NoteLink key={item.id} note={item} depth={depth + 1} />
        ))}
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

  return (
    <ContextMenu items={getItems(note)}>
      <Link
        to={`notes/${note.id}`}
        className="flex items-center gap-3 rounded-md py-1.5 pl-3 pr-3 "
        getActiveProps={() => ({
          className: "bg-gray-100 dark:bg-gray-800",
        })}
        getInactiveProps={() => ({
          className:
            "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
        })}
        style={{
          paddingLeft:
            typeof depth !== "undefined"
              ? `${(depth + 1.6) * 1}rem`
              : undefined,
        }}
      >
        <span className="flex h-5 w-5 items-center justify-center text-lg">
          <NoteIcon note={note} />
        </span>
        <p className="flex-1 truncate">{note.title || "Untitled"}</p>
      </Link>
    </ContextMenu>
  );
};
