import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import AppError from "../../utilities/AppError";
import { jwtHelpers } from "../../utilities/jwtHelpers";
import { TRegisterUser, TLoginUser, TJwtPayload } from "./auth.interface";

const registerUser = async (payload: TRegisterUser) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
  });

  const jwtPayload: TJwtPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in);
  const refreshToken = jwtHelpers.generateToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in);

  const { password, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  if (user.isBanned) {
    throw new AppError(403, "Your account has been banned. Contact support.");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const jwtPayload: TJwtPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in);
  const refreshToken = jwtHelpers.generateToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in);

  const { password, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
};

export const AuthService = { registerUser, loginUser, getMe };