import Notebook from "../types/notebook";

export default function getNotebookChildCount(notebook: Notebook) {
  return (notebook._count?.notebooks || 0) + (notebook._count?.notes || 0);
}
