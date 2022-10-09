import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesAsync } from "../api/workspaceApi";

export default function useWorkspacesQuery() {
  const query = useQuery(["workspaces"], getAllWorkspacesAsync);
  return {
    ...query,
  };
}
