import { Link } from "@tanstack/react-location";
import { FiList, FiInbox, FiStar, FiTrash } from "react-icons/fi";

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

const MainMenu = () => (
  <nav className="space-y-px px-2">
    {mainMenu.map((item, i) => (
      <Link
        key={i}
        to={item.to}
        className="flex cursor-default items-center gap-3 rounded-md px-3 py-1.5"
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
);

export default MainMenu;
