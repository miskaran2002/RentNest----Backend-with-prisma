import { Role } from "../../../generated/prisma/enums";


export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD"; // ADMIN can never self-register
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  userId: string;
  email: string;
  role: Role;
};