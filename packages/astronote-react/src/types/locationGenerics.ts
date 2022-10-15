import { MakeGenerics } from "@tanstack/react-location";

export type LocationGenerics = MakeGenerics<{
  Params: { workspaceId?: string; notebookId?: string; noteId?: string };
}>;
