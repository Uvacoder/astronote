import { Outlet, useMatch } from "@tanstack/react-location";
import clsx from "clsx";
import useApp from "../../store/useApp";
import useWroksapces from "../../store/useWorkspaces";
import { LocationGenerics } from "../../types/locationGenerics";
import WorkspaceSidebar from "./workspace-sidebar";

const Workspace = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const sidebarHidden = useApp((state) => state.sidebarHidden);

  const workspace = useWroksapces((state) =>
    state.workspaces.find((item) => item.id === workspaceId)
  );

  if (!workspace) {
    return <div>Workspace Not Found</div>;
  }

  return (
    <div className="flex h-full w-full">
      <WorkspaceSidebar workspace={workspace} />
      <div
        className={clsx("flex-1 overflow-hidden transition-all duration-300", {
          "md:ml-72": !sidebarHidden,
        })}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Workspace;
