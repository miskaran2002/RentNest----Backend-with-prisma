import { Role } from "../../../generated/prisma/enums";

export type IUserResponse = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
};