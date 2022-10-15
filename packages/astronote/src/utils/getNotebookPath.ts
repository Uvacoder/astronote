import Notebook from "../types/notebook";

export default function getNotebookPath(notebook: Notebook) {
  return `/workspaces/${notebook.workspaceId}/notebooks/${notebook.id}`;
}
