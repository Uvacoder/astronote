import { Navigate, Outlet } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAsync } from "../api/userApi";
import WorkspaceListBar from "../components/WorkspaceListBar";

const AppLayout = () => {
  const userQuery = useQuery(["current-user"], getCurrentUserAsync, {
    retry: false,
  });

  if (userQuery.isLoading) {
    return (
      <div className="loading-box">
        <span className="loader" />
        loading...
      </div>
    );
  }

  if (!userQuery.data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <WorkspaceListBar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
