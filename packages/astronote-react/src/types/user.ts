import type UserRole from "./userRole";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
}

export default User;
