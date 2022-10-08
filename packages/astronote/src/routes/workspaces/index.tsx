import { Link, Outlet } from "@tanstack/react-location";

const Workspaces = () => {
  return (
    <div className="flex h-screen w-screen flex-1">
      <div className="h-full w-16 border-r border-gray-100 dark:border-gray-800">
        <nav className="flex flex-col items-center">
          <Link
            to="1"
            getActiveProps={() => ({
              className: "font-bold",
            })}
          >
            1
          </Link>
          <Link
            to="2"
            getActiveProps={() => ({
              className: "font-bold",
            })}
          >
            2
          </Link>
          <Link
            to="3"
            getActiveProps={() => ({
              className: "font-bold",
            })}
          >
            3
          </Link>
        </nav>
      </div>

      <Outlet />
    </div>
  );
};

export default Workspaces;
