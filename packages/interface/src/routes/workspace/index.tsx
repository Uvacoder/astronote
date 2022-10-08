import { Outlet } from "@tanstack/react-location";
import WorkspaceSidebar from "./WorkspaceSidebar";

const Workspace = () => {
  return (
    <div className="flex-1 w-full h-full flex">
      <WorkspaceSidebar />
      <Outlet />
    </div>
  );
};

export default Workspace;
