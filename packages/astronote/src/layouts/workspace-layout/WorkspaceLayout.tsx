import { Outlet } from "@tanstack/react-location";
import WorkspaceSidebar from "./WorkspaceSidebar";

export default function WorkspaceLayout() {
  return (
    <div className="flex h-full w-full">
      <WorkspaceSidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
