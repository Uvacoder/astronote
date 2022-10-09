import { useMatch } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { fetchAllNotebooks } from "../api/notebookApi";
import { LocationGenerics } from "../types/locationGenerics";

export default function useNotebooksQuery() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notebooksQuery = useQuery(["notebooks", workspaceId], () =>
    fetchAllNotebooks(workspaceId)
  );

  return {
    ...notebooksQuery,
  };
}
