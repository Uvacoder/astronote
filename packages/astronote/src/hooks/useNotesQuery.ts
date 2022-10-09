import { useMatch } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { getAllNotesAsync } from "../api/noteApi";
import { LocationGenerics } from "../types/locationGenerics";

export default function useNotesQuery() {
  const {
    params: { workspaceId },
  } = useMatch<LocationGenerics>();
  const notesQuery = useQuery(["notes", workspaceId], () =>
    getAllNotesAsync(workspaceId)
  );

  return {
    ...notesQuery,
  };
}
