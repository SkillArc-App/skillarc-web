import { prisma } from '../db/client'

const findOne = async (email: string) => {
  return await prisma.tempUser.findUnique({
    where: {
      email: email,
    },
  })
}

const deleteOne = async (id: string) => {
  return await prisma.tempUser.delete({
    where: {
      id: id,
    },
  })
}

export const APITempUserService = {
  findOne,
  deleteOne,
}
