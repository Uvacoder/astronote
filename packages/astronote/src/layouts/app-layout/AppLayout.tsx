import { Navigate, Outlet } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAsync } from "../../api/userApi";
import AppSidebar from "./AppSidebar";
import { useTheme } from "../../contexts/themeContext";
import SyncLoader from "react-spinners/SyncLoader";
import { useState, useEffect, useCallback } from "react";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import useWroksapces from "../../store/useWorkspaces";

const AppLayout = () => {
  const { isDark } = useTheme();
  const userQuery = useQuery(["current-user"], getCurrentUserAsync, {
    retry: false,
  });
  const fetchNotes = useNotes((state) => state.fetch);
  const fetchNotebooks = useNotebooks((state) => state.fetch);
  const fetchWorkspaces = useWroksapces((state) => state.fetch);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchWorkspaces(), fetchNotebooks(), fetchNotes()]);
    setIsLoading(false);
  }, [setIsLoading, fetchNotebooks, fetchNotes, fetchWorkspaces]);

  useEffect(() => {
    if (userQuery.data) {
      fetchAllData();
    }
  }, [userQuery.data, fetchAllData]);

  if (userQuery.isLoading || isLoading) {
    return (
      <div className="fixed z-50 flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
        <SyncLoader
          color={isDark ? "#fff" : "#0f172a"}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (!userQuery.data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
