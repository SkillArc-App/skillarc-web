import { prisma } from '../db/client'

const findOne = async (id: string) => {
  return await prisma.masterCertification.findUnique({
    where: {
      id: id,
    },
  })
}

const findMany = async () => {
  return await prisma.masterCertification.findMany()
}

export const APIMasterCertificationService = {
  findOne,
  findMany,
}
