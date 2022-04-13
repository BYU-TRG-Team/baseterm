import { UUID } from ".";

export enum Role {
  Admin = 3,
  Staff = 2,
  User = 1,
  Inactive = 0,
}

export type AuthToken = {
  id: UUID;
  role: Role;
  verified: boolean;
  username: string;
}

export type User = {
  user_id: UUID;
  username: string;
  verified: boolean;
  password: string;
  email: string;
  name: string;
  role_id: Role;
}