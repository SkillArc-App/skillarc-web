import { prisma } from '../db/client'

const create = async (data: any, profileId: string) => {
  return await prisma.credential.create({
    data: { ...data, profileId: profileId },
  })
}

export const APICredentialService = {
  create,
}
