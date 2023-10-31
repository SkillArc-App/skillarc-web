import { ProfileCertification } from '@prisma/client'
import { prisma } from '../db/client'

const create = async (data: any, profileId: string) => {
  return await prisma.profileCertification.create({
    data: { ...data, profileId: profileId },
  })
}

const updateProfileCertification = async (
  profileId: string,
  profileCertificationId: string,
  profileCertification: {
    id: string
    profile_id: string
  },
) => {
  profileCertification = {
    ...profileCertification,
    profile_id: profileId,
    id: profileCertificationId,
  }

  return await prisma.profileCertification.update({
    where: {
      id: profileCertification.id,
    },
    data: {
      ...profileCertification,
      profile_id: profileCertification.profile_id,
    },
  })
}

const deleteProfileCertification = async (profileId: string, profileCertificationId: string) => {
  return await prisma.profileCertification.delete({
    where: {
      id: profileCertificationId,
    },
  })
}

export const APIProfileCertificationService = {
  create,
  updateProfileCertification,
  deleteProfileCertification,
}
