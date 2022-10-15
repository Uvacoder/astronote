import { Navigate, Outlet } from "@tanstack/react-location";
import { useTheme } from "../../contexts/themeContext";
import SyncLoader from "react-spinners/SyncLoader";
import { useState, useEffect, useCallback } from "react";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import useWroksapces from "../../store/useWorkspaces";
import { useAuth } from "../../contexts/authContext";

const Workspaces = () => {
  const { user } = useAuth();
  const fetchNotes = useNotes((state) => state.fetch);
  const fetchNotebooks = useNotebooks((state) => state.fetch);
  const fetchWorkspaces = useWroksapces((state) => state.fetch);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchWorkspaces(), fetchNotebooks(), fetchNotes()]);
    setIsLoading(false);
  }, [setIsLoading, fetchNotebooks, fetchNotes, fetchWorkspaces]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="fixed z-50 flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
        <SyncLoader
          color={isDark ? "#fff" : "#0f172a"}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Workspaces;
