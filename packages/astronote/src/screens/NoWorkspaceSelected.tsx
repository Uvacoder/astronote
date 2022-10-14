import { Navigate } from "@tanstack/react-location";
import useWroksapces from "../store/useWorkspaces";

const NoWorkspaceSelected = () => {
  const workspace = useWroksapces((state) => state.workspaces[0]);

  if (workspace) {
    return <Navigate to={`/workspaces/${workspace.id}`} replace />;
  }
  return <div>NoWorkspaceSelected</div>;
};

export default NoWorkspaceSelected;
