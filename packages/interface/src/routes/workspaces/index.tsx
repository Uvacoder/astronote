import { Link, Outlet } from "@tanstack/react-location";

const Workspaces = () => {
  return (
    <div className="w-screen h-screen flex-1 flex">
      <div className="h-full w-16 border-r border-gray-100 dark:border-gray-800">
        <nav className="flex items-center flex-col">
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
