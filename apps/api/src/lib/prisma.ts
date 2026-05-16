import { PrismaClient } from "@prisma/client";

declare global {
  var __aegisPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__aegisPrisma__ ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__aegisPrisma__ = prisma;
}

