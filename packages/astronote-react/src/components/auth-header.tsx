import { Link } from "@tanstack/react-location";

const AuthHeader = () => {
  return (
    <header className="flex h-14 items-center gap-8 border-b border-gray-100 px-6 dark:border-gray-800">
      <Link to="/">
        <a className="text-xl font-semibold">Astronote</a>
      </Link>
      <nav className="flex flex-1 items-center justify-end gap-2">
        <Link
          to="/login"
          className="flex h-10 items-center rounded-md px-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="flex h-10 items-center rounded-md border border-gray-100 px-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default AuthHeader;
