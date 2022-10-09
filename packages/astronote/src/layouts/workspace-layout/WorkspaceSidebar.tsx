import { Link, useMatch } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FiPlus,
  FiList,
  FiStar,
  FiTrash,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";
import { getWorkspaceAsync } from "../../api/workspaceApi";
import CreateNotebookDialog from "../../components/CreateNotebookDialog";
import NoteIcon from "../../components/NoteIcon";
import NotebookIcon from "../../components/NotebookIcon";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import ContextMenu from "../../components/ContextMenu";
import useNotebooksQuery from "../../hooks/useNotebooksQuery";
import useNotesQuery from "../../hooks/useNotesQuery";
import useNoteContextMenu from "../../hooks/useNoteContextMenu";
import useNotebookContextMenu from "../../hooks/useNotebookContextMenu";
import getNotebookChildCount from "../../utils/getNotebookChildCount";

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
    to: "unsorted",
    label: "Unsorted",
    icon: <FiInbox />,
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

  const workspaceQuery = useQuery(["workspace", workspaceId], () =>
    getWorkspaceAsync(workspaceId)
  );

  return (
    <aside className="workspace-sidebar h-full w-72 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
      <header className="sticky top-0 flex h-12 w-full items-center bg-white px-4 dark:bg-gray-900">
        <div className="flex flex-1 items-center">
          {workspaceQuery.data?.emoji && (
            <span className="mr-2 text-xl">{workspaceQuery.data?.emoji}</span>
          )}
          <p className="flex-1">{workspaceQuery.data?.name}</p>
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

const PinnedNotes = () => {
  const { data: allNotes } = useNotesQuery();
  const pinnedNotes = useMemo(
    () => (allNotes || []).filter((note) => !note.isDeleted && note.isPinned),
    [allNotes]
  );

  if (pinnedNotes.length === 0) {
    return null;
  }

  return (
    <section id="folders" className="my-8">
      <div className="mb-2 flex items-center px-4">
        <p className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
          Pinned
        </p>
      </div>
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
  const { data: allNotebooks } = useNotebooksQuery();
  const { data: allNotes } = useNotesQuery();

  const items = useMemo(
    () => [
      ...(allNotebooks || []).filter((notebook) => !notebook.parentId),
      ...(allNotes || []).filter((note) => !note.isDeleted && !note.notebookId),
    ],
    [allNotebooks, allNotes]
  );

  return (
    <section id="folders" className="my-8">
      <div className="mb-2 flex items-center px-4">
        <p className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
          Notebooks
        </p>
        <CreateNotebookDialog workspaceId={workspaceId}>
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiPlus />
          </button>
        </CreateNotebookDialog>
      </div>

      <nav className="space-y-px px-2">
        {items?.map((item) => {
          switch (item._type) {
            case "note":
              return <NoteLink key={item.id} note={item} depth={0} />;
            case "notebook":
              return <NotebookLink key={item.id} notebook={item} depth={0} />;
          }
        })}
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
  const { data: allNotebooks } = useNotebooksQuery();
  const { data: allNotes } = useNotesQuery();

  const children = useMemo(
    () => [
      ...(allNotebooks || []).filter((item) => item.parentId === notebook.id),
      ...(allNotes || []).filter(
        (note) => !note.isDeleted && note.notebookId === notebook.id
      ),
    ],
    [allNotebooks, allNotes, notebook]
  );

  const childCount = useMemo(() => getNotebookChildCount(notebook), [notebook]);

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
        {children.length > 0 && (
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

      {expand
        ? children.map((item) => {
            if (item._type === "notebook") {
              return (
                <NotebookLink key={item.id} notebook={item} depth={depth + 1} />
              );
            }
            if (item._type === "note") {
              return <NoteLink key={item.id} note={item} depth={depth + 1} />;
            }
          })
        : null}
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
