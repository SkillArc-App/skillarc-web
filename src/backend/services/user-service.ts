import { prisma } from '../db/client'

const findOne = async (id: string) => {
  const u = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      onboardingSession: true,
      userRoles: { include: { role: true } },
      trainingProviderProfile: {
        include: {
          trainingProvider: true,
        },
      },
      recruiter: true,
      profile: {
        include: {
          preferences: true,
          stories: true,
          skills: true,
          otherExperiences: true,
          personalExperience: true,
          educationExperiences: true,
          profileSkills: { include: { masterSkill: true } },
          profileCertifications: { include: { masterCertification: true } },
          desiredOutcomes: true,
          professionalInterests: true,
        },
      },
    },
  })

  return u
}

const update = async (id: string, data: {}) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
    include: {
      profile: true,
    },
  })
}

const updateOneUserWithTempData = async (id: string, data: {}) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
    include: {
      profile: true,
      onboardingSession: true,
      jobInteractions: true,
    },
  })
}

const findMany = async () => {
  return await prisma.user.findMany()
}

const deleteOne = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  })
}

export const APIUserService = {
  findOne,
  update,
  findMany,
  updateOneUserWithTempData,
  deleteOne,
}
