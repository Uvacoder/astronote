import { Outlet, useMatch } from "@tanstack/react-location";
import useWroksapces from "../../store/useWorkspaces";
import { LocationGenerics } from "../../types/locationGenerics";
import WorkspaceSidebar from "./WorkspaceSidebar";

const Workspace = () => {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();

  const workspace = useWroksapces((state) =>
    state.workspaces.find((item) => item.id === workspaceId)
  );

  if (!workspace) {
    return <div>Workspace Not Found</div>;
  }

  return (
    <div className="flex h-full w-full">
      <WorkspaceSidebar workspace={workspace} />
      <Outlet />
    </div>
  );
};

export default Workspace;
