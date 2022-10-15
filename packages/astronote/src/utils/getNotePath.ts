import Note from "../types/note";

export default function getNotePath(note: Note) {
  return `/workspaces/${note.workspaceId}/notes/${note.id}`;
}
