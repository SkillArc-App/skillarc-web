import { ProfileSkill } from '@prisma/client'
import { prisma } from '../db/client'

const create = async (data: ProfileSkill, profileId: string) => {
  return await prisma.profileSkill.create({
    data: { ...data, profile_id: profileId },
  })
}

const updateProfileSkills = async (
  profileId: string,
  profileSkillsId: string,
  profileSkills: ProfileSkill,
) => {
  profileSkills = {
    ...profileSkills,
    profile_id: profileId,
    id: profileSkillsId,
  }

  return await prisma.otherExperience.update({
    where: {
      id: profileSkills.id,
    },
    data: {
      ...profileSkills,
      profile_id: profileSkills.profile_id,
    },
  })
}

const deleteProfileSkills = async (profileId: string, profileSkillsId: string) => {
  return await prisma.profileSkill.delete({
    where: {
      id: profileSkillsId,
    },
  })
}

export const APIProfileSkillsService = {
  create,
  updateProfileSkills,
  deleteProfileSkills,
}
