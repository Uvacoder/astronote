interface Notebook {
  _type: "notebook";
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  emoji: string | null;
  userId: string;
  workspaceId: string;
  parentId: string | null;
  _count?: {
    notebooks?: number;
    notes?: number;
  };
}

export default Notebook;
