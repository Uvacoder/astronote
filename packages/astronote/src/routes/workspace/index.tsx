import { Outlet } from "@tanstack/react-location";
import WorkspaceSidebar from "./WorkspaceSidebar";

const Workspace = () => {
  return (
    <div className="flex h-full w-full flex-1">
      <WorkspaceSidebar />
      <Outlet />
    </div>
  );
};

export default Workspace;
