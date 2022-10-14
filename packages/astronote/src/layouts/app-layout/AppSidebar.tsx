import { Link } from "@tanstack/react-location";
import color from "color";
import { FiPlus, FiSettings } from "react-icons/fi";
import CreateWorkspaceDialog from "../../components/CreateWorkspaceDialog";
import getSortName from "../../utils/getSortName";
import useWroksapces from "../../store/useWorkspaces";

export default function AppSidebar() {
  const workspaces = useWroksapces((state) => state.workspaces);

  return (
    <aside className="flex h-full flex-col items-center overflow-y-auto border-r border-gray-100 p-3 dark:border-gray-800">
      <div className="h-8"></div>
      <nav className="flex flex-col items-center gap-3">
        {workspaces.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gray-900 text-lg font-medium text-white transition-all duration-150 ease-in-out hover:rounded-xl dark:bg-white dark:text-gray-900"
            getActiveProps={() => ({
              className:
                "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-900 dark:ring-white",
            })}
            style={{
              backgroundColor: item.color ? color(item.color).hex() : undefined,
              color: item.color
                ? color(item.color).isDark()
                  ? "#fff"
                  : "#000"
                : undefined,
            }}
          >
            {item.emoji ? (
              <span className="text-2xl">{item.emoji}</span>
            ) : (
              getSortName(item.name)
            )}
          </Link>
        ))}
        <CreateWorkspaceDialog>
          <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gray-100 text-2xl text-gray-900 transition-all ease-in-out hover:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
            <FiPlus />
          </button>
        </CreateWorkspaceDialog>
        <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gray-100 text-2xl text-gray-900 transition-all ease-in-out hover:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
          <FiSettings />
        </button>
      </nav>
    </aside>
  );
}
