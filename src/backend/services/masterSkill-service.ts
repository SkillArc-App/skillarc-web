import { prisma } from '../db/client'

const findOne = async (id: string) => {
  return await prisma.masterSkill.findUnique({
    where: {
      id: id,
    },
  })
}

const findMany = async () => {
  return await prisma.masterSkill.findMany()
}

export const APIMasterSkillService = {
  findOne,
  findMany,
}
