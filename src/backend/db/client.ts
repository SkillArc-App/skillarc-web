import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [],
  })

if (process.env.NEXT_PUBLIC_ENV !== 'prod') globalForPrisma.prisma = prisma
