import { Link } from "@tanstack/react-location";
import { FC, useMemo } from "react";
import { FiList, FiInbox, FiStar, FiTrash } from "react-icons/fi";
import useNotes from "../../store/useNotes";

export interface MainMenuProps {
  workspaceId: string;
}

const MainMenu: FC<MainMenuProps> = ({ workspaceId }) => {
  const notesCount = useNotes((state) => {
    const allNotes = state.notes.filter(
      (note) => !note.isDeleted && note.workspaceId === workspaceId
    );
    return {
      all: allNotes.length,
      unsorted: allNotes.filter((item) => !item.notebookId).length,
      starred: allNotes.filter((item) => item.isFavorite).length,
      trashed: state.notes.filter(
        (item) => item.workspaceId === workspaceId && item.isDeleted
      ).length,
    };
  });
  const mainMenu = useMemo(
    () => [
      {
        to: "all",
        label: "All Notes",
        icon: <FiList />,
        count: notesCount.all,
      },
      {
        to: "unsorted",
        label: "Unsorted",
        icon: <FiInbox />,
        count: notesCount.unsorted,
      },
      {
        to: "starred",
        label: "Starred",
        icon: <FiStar />,
        count: notesCount.starred,
      },
      {
        to: "trash",
        label: "Trash",
        icon: <FiTrash />,
        count: notesCount.trashed,
      },
    ],
    [notesCount]
  );

  return (
    <nav className="space-y-px px-2">
      {mainMenu.map((item, i) => (
        <Link
          key={i}
          to={item.to}
          className="flex items-center gap-3 rounded-md px-3 py-1.5"
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
          <span className="flex-1 truncate">{item.label}</span>
          {!!item.count && item.count > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default MainMenu;
