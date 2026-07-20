import app from "../src/app";
import { prisma } from "../src/lib/prisma";

let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await prisma.$connect();
    isConnected = true;
    console.log("Connected to the database successfully");
  }
}

export default async function handler(req: any, res: any) {
  await ensureConnection();
  return app(req, res);
}