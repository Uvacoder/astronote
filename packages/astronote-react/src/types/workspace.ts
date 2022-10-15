export interface Workspcae {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  color?: string | null;
  emoji?: string | null;
  description: string | null;
  userId: string;
}

export default Workspcae;
