import { Navigate, Outlet } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAsync } from "../../api/userApi";
import AppSidebar from "./AppSidebar";

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
    <div className="flex h-screen w-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
