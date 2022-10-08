import { MakeGenerics } from "@tanstack/react-location";
import Note from "./note";
import Notebook from "./notebook";
import { Workspcae } from "./workspace";

export type LocationGenerics = MakeGenerics<{
  Params: { workspaceId: string; notebookId: string; noteId: string };
  LoaderData: {
    workspaces: Workspcae[];
    workspace: Workspcae;
    notebooks: Notebook[];
    notes: Note[];
  };
}>;
