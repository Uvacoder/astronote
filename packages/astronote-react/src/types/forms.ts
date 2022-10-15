export interface LogInInputs {
  email: string;
  password: string;
}
export interface SignUpInputs {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface CreateWorkspaceInputs {
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
}
export interface UpdateWorkspaceInputs {
  name?: string;
  description?: string;
  emoji?: string;
  color?: string;
}
export interface CreateNotebookInputs {
  workspaceId: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  parentId?: string | null;
}
export interface UpdateNotebookInputs {
  name?: string;
  description?: string | null;
  emoji?: string | null;
  parentId?: string | null;
}

export interface CreateNoteInputs {
  workspaceId: string;
  title?: string;
  description?: string | null;
  content?: any;
  meta?: any;
  notebookId?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;
}
export interface UpdateNoteInputs {
  title?: string | null;
  description?: string | null;
  content?: any;
  meta?: any;
  notebookId?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;
}
