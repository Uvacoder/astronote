interface Notebook {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  emoji: string | null;
  workspaceId: string;
  parentId: string | null;
}

export default Notebook;
