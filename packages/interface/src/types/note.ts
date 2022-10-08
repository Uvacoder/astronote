interface Note {
  _type: "note";
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string | null;
  description: string | null;
  content?: any | null;
  meta?: any | null;
  userId: string;
  isFavorite?: boolean | null;
  isPinned?: boolean | null;
  isDeleted?: boolean | null;
  workspaceId: string;
  notebookId: string | null;
}

export default Note;
