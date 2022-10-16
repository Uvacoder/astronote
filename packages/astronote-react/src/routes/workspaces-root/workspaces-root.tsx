import { Navigate } from "@tanstack/react-location";
import useWroksapces from "../../store/useWorkspaces";

const WorkspacesRoot = () => {
  const workspace = useWroksapces((state) => state.workspaces[0]);

  if (workspace) {
    return <Navigate to={`/workspaces/${workspace.id}`} replace />;
  }
  return <div>NoWorkspaceSelected</div>;
};

export default WorkspacesRoot;
