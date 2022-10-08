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
    <aside className="h-full w-72 border-r border-gray-100 dark:border-gray-800 flex flex-col workspace-sidebar">
      <header className="h-12 w-full px-4 flex items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center flex-1">
          {workspaceQuery.data?.emoji && (
            <span className="text-xl mr-2">{workspaceQuery.data?.emoji}</span>
          )}
          <p className="flex-1">{workspaceQuery.data?.name}</p>
        </div>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
          <FiSettings />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pt-2 pb-32 space-y-8">
        <section id="main-menu">
          <nav className="px-2">
            {mainMenu.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 px-3 py-1.5 rounded-md "
                getActiveProps={() => ({
                  className: "bg-gray-100 dark:bg-gray-800",
                })}
                getInactiveProps={() => ({
                  className:
                    "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50",
                })}
              >
                <span className="text-xl w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section id="folders" className="my-8">
          <div className="flex items-center mb-2 px-4">
            <p className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
              Notebooks
            </p>
            <CreateNotebookDialog workspaceId={workspaceId}>
              <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center w-6 h-6 rounded-md text-lg">
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
        <Link
          to={`notebooks/${notebook.id}`}
          className="flex items-center gap-3 pl-8 pr-3 py-1 rounded-md group"
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
          <span className="text-lg w-5 h-5 flex items-center justify-center">
            <NotebookIcon notebook={notebook} />
          </span>
          <p className="flex-1 truncate">{notebook.name}</p>
          {childCount > 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {childCount}
            </p>
          )}
        </Link>
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
    <Link
      to={`notes/${note.id}`}
      className="flex items-center gap-3 pl-8 pr-3 py-1 rounded-md "
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
      <span className="text-lg w-5 h-5 flex items-center justify-center">
        <NoteIcon note={note} />
      </span>
      <p className="truncate flex-1">{note.title || "Untitled"}</p>
    </Link>
  );
};
