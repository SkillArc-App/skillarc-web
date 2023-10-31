import { prisma } from '@/backend/db/client'
import { seed } from '@/backend/prisma/common-seed'

export default async function seedDB() {
  return await seed(prisma)
}
