import { Link, Navigate, Outlet } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAsync } from "../api/userApi";

const AuthLayout = () => {
  const userQuery = useQuery(["current-user"], getCurrentUserAsync, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (userQuery.status === "loading") {
    return (
      <div className="loading-box">
        <span className="loader" />
        loading...
      </div>
    );
  }

  if (userQuery.status === "success" && userQuery.data) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <>
      <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center gap-8 px-6">
        <Link to="/">
          <a className="text-xl font-semibold">Astronote</a>
        </Link>
        <nav className="flex-1 flex items-center justify-end gap-2">
          <Link
            to="/login"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 px-4 h-10 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 px-4 h-10 flex items-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default AuthLayout;
