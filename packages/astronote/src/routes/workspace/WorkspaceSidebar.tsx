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
import { getAllNotesAsync } from "../../api/noteApi";
import { fetchAllNotebooks } from "../../api/notebookApi";
import { getWorkspaceAsync } from "../../api/workspaceApi";
import CreateNotebookDialog from "../../components/CreateNotebookDialog";
import NoteIcon from "../../components/note-icon";
import NotebookIcon from "../../components/notebook-icon";
import { LocationGenerics } from "../../types/locationGenerics";
import Note from "../../types/note";
import Notebook from "../../types/notebook";
import ContextMenu from "../../components/ContextMenu";

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

const WorkspaceSidebar = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();

  const workspaceQuery = useQuery(["workspace", workspaceId], () =>
    getWorkspaceAsync(workspaceId)
  );

  return (
    <aside className="workspace-sidebar flex h-full w-72 flex-col border-r border-gray-100 dark:border-gray-800">
      <header className="flex h-12 w-full items-center border-b border-gray-100 px-4 dark:border-gray-800">
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

      <div className="flex-1 space-y-8 overflow-y-auto pt-2 pb-32">
        <section id="main-menu">
          <nav className="px-2">
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
                    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50",
                })}
              >
                <span className="flex h-6 w-6 items-center justify-center text-xl">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

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
          <Folders />
        </section>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;

const Folders = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notebooksQuery = useQuery(["notebooks", workspaceId], () =>
    fetchAllNotebooks(workspaceId)
  );

  const rootNotebooks = useMemo(
    () => notebooksQuery.data?.filter((notebook) => !notebook.parentId),
    [notebooksQuery]
  );

  return (
    <nav className="px-2">
      {rootNotebooks?.map((notebook) => (
        <NotebookLink key={notebook.id} notebook={notebook} />
      ))}
    </nav>
  );
};

const NotebookLink = ({
  notebook,
  depth = 0,
}: {
  notebook: Notebook;
  depth?: number;
}) => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notebooksQuery = useQuery(["notebooks", workspaceId], () =>
    fetchAllNotebooks(workspaceId)
  );
  const notesQuery = useQuery(["notes", workspaceId], () =>
    getAllNotesAsync(workspaceId)
  );
  const [expand, setExpand] = useState(false);

  const children = useMemo(
    () => [
      ...(notebooksQuery.data?.filter(
        (item) => item.parentId === notebook.id
      ) || []),
      ...(notesQuery.data?.filter((note) => note.notebookId === notebook.id) ||
        []),
    ],
    [notebooksQuery, notesQuery, notebook]
  );
  const childCount = useMemo(
    () => (notebook._count?.notebooks || 0) + (notebook._count?.notes || 0),
    [notebook]
  );

  return (
    <>
      <div className="relative">
        <ContextMenu
          items={[
            {
              type: "button",
              label: "New Note",
            },
            {
              type: "button",
              label: "New Notebook",
            },
            {
              type: "separator",
            },
            {
              type: "button",
              label: "Copy Link",
            },
            {
              type: "separator",
            },
            {
              type: "button",
              label: "Move to",
            },
            {
              type: "button",
              label: "Edit",
            },
            {
              type: "button",
              label: "Delete",
            },
          ]}
        >
          <Link
            to={`notebooks/${notebook.id}`}
            className="group flex select-none items-center gap-3 rounded-md py-1 pl-8 pr-3"
            getActiveProps={() => ({
              className: "bg-gray-100 dark:bg-gray-800",
            })}
            getInactiveProps={() => ({
              className:
                "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50",
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

const NoteLink = ({ note, depth = 0 }: { note: Note; depth?: number }) => {
  return (
    <ContextMenu
      items={[
        {
          type: "button",
          label: "Duplicate",
        },
        {
          type: "button",
          label: "Copy Link",
        },
        {
          type: "sub",
          label: "Copy as",
          items: [
            {
              type: "button",
              label: "Plain Text",
            },
            {
              type: "button",
              label: "Markdown",
            },
            {
              type: "button",
              label: "Html",
            },
            {
              type: "button",
              label: "Json",
            },
          ],
        },
        {
          type: "separator",
        },
        {
          type: "sub",
          label: "Export as",
          items: [
            {
              type: "button",
              label: "Text File",
            },
            {
              type: "button",
              label: "Markdown File",
            },
            {
              type: "button",
              label: "Html File",
            },
            {
              type: "button",
              label: "Json File",
            },
          ],
        },
        {
          type: "button",
          label: "Delete",
        },
      ]}
    >
      <Link
        to={`notes/${note.id}`}
        className="flex items-center gap-3 rounded-md py-1 pl-8 pr-3 "
        getActiveProps={() => ({
          className: "bg-gray-100 dark:bg-gray-800",
        })}
        getInactiveProps={() => ({
          className:
            "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50",
        })}
        style={{
          paddingLeft: `${(depth + 1.6) * 1}rem`,
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
