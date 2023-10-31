import {
  EducationExperience,
  OtherExperience,
  PersonalExperience,
  Preference,
  Profile,
  Skills,
  Story,
} from '@prisma/client'
import { prisma } from '../db/client'
import hiringStatus from './hiring-status-service'

const findOne = async (id: string) => {
  const p = await prisma.profile.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        include: {
          SeekerTrainingProvider: {
            include: {
              program: {
                include: {
                  programSkill: { include: { skill: true } },
                  trainingProvider: true,
                },
              },
            },
          },
        },
      },
      credentials: true,
      desiredOutcomes: true,
      educationExperiences: true,
      networkInterests: true,
      otherExperiences: true,
      personalExperience: true,
      preferences: true,
      reference: {
        include: { authorProfile: { include: { user: true } }, trainingProvider: true },
      },
      professionalInterests: true,
      skills: true,
      stories: true,
      profileSkills: { include: { masterSkill: true } },
      profileCertifications: { include: { masterCertification: true } },
    },
  })

  if (!p) throw new Error(`Profile not found for id ${id}`)

  return {
    ...p,
    hiringStatus: await hiringStatus(p.id),
    programs: p?.user?.SeekerTrainingProvider.map((stp) => stp?.program),
  }
}

const findOneByUserId = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: {
      user_id: userId,
    },
  })
}

const create = async (data: Profile) => {
  return await prisma.profile.upsert({
    where: {
      user_id: data?.user_id,
    },
    create: data,
    update: data,
  })
}

const findMany = async () => {
  return await prisma.profile.findMany({
    include: {
      user: {
        include: {
          SeekerTrainingProvider: {
            include: {
              program: true,
              trainingProvider: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

const addPreferences = async (profile_id: string, preference: Preference) => {
  return await prisma.preference.create({
    data: {
      ...preference,
      profile_id: profile_id,
    },
  })
}

const updatePreferences = async (id: string, data: Partial<Preference>) => {
  return await prisma.profile.update({
    where: {
      id: id,
    },
    data: {
      preferences: {
        update: data,
      },
    },
  })
}

const updateProfile = async (id: string, data: Partial<Profile>) => {
  return await prisma.profile.update({
    where: {
      id: id,
    },
    data: data,
  })
}

const addStory = async (profileId: string, story: Story) => {
  return await prisma.story.create({
    data: {
      ...story,
      profile_id: profileId,
    },
  })
}

const updateStory = async (profileId: string, storyId: string, story: Partial<Story>) => {
  story = {
    ...story,
    profile_id: profileId,
    id: storyId,
  }
  return await prisma.story.update({
    where: {
      id: storyId,
    },
    data: story,
  })
}

const deleteStory = async (profileId: string, storyId: string) => {
  return await prisma.story.delete({
    where: {
      id: storyId,
    },
  })
}

const createSkill = async (profileId: string, skill: Skills) => {
  return await prisma.skills.create({
    data: {
      ...skill,
      profile_id: profileId,
    },
  })
}

const updateSkill = async (profileId: string, skillId: string, skill: Partial<Skills>) => {
  skill = {
    ...skill,
    profile_id: profileId,
    id: skillId,
  }

  return await prisma.skills.update({
    where: {
      id: skill.id,
    },
    data: {
      ...skill,
      profile_id: skill.profile_id,
    },
  })
}

const deleteSkill = async (profileId: string, skillId: string) => {
  return await prisma.skills.delete({
    where: {
      id: skillId,
    },
  })
}

const createOtherExpereince = async (profileId: string, otherExperience: OtherExperience) => {
  return await prisma.otherExperience.create({
    data: {
      ...otherExperience,
      profile_id: profileId,
    },
  })
}

const updateOtherExperience = async (
  profileId: string,
  otherExperienceId: string,
  otherExperience: Partial<OtherExperience>,
) => {
  otherExperience = {
    ...otherExperience,
    profile_id: profileId,
    id: otherExperienceId,
  }

  return await prisma.otherExperience.update({
    where: {
      id: otherExperience.id,
    },
    data: {
      ...otherExperience,
      profile_id: otherExperience.profile_id,
    },
  })
}

const deleteOtherExperience = async (profileId: string, otherExperienceId: string) => {
  return await prisma.otherExperience.delete({
    where: {
      id: otherExperienceId,
    },
  })
}

const createPersonalExperience = async (profileId: string, personalExperience: {}) => {
  return await prisma.personalExperience.create({
    data: {
      ...personalExperience,
      profile_id: profileId,
    },
  })
}

const updatePersonalExperience = async (
  personalExperienceId: string,
  personalExperience: PersonalExperience,
) => {
  personalExperience = {
    ...personalExperience,
    id: personalExperienceId,
  }

  return await prisma.personalExperience.update({
    where: {
      id: personalExperience.id,
    },
    data: {
      ...personalExperience,
    },
  })
}

const deletePersonalExperience = async (personalExperienceId: string) => {
  return await prisma.personalExperience.delete({
    where: {
      id: personalExperienceId,
    },
  })
}

const createEducationExperiences = async (
  profileId: string,
  educationExperience: EducationExperience,
) => {
  return await prisma.educationExperience.create({
    data: {
      ...educationExperience,
      profile_id: profileId,
    },
  })
}

const updateEducationExperience = async (
  profileId: string,
  educationExperienceId: string,
  educationExperience: EducationExperience,
) => {
  educationExperience = {
    ...educationExperience,
    profile_id: profileId,
    id: educationExperienceId,
  }

  return await prisma.educationExperience.update({
    where: {
      id: educationExperience.id,
    },
    data: {
      ...educationExperience,
      profile_id: educationExperience.profile_id,
    },
  })
}

const deleteEducationExperience = async (profileId: string, educationExperienceId: string) => {
  return await prisma.educationExperience.delete({
    where: {
      id: educationExperienceId,
    },
  })
}

export const APIProfileService = {
  findOne,
  findMany,
  create,
  updateProfile,
  addPreferences,
  updatePreferences,
  addStory,
  updateStory,
  deleteStory,
  createSkill,
  updateSkill,
  deleteSkill,
  createOtherExpereince,
  updateOtherExperience,
  deleteOtherExperience,
  createPersonalExperience,
  updatePersonalExperience,
  deletePersonalExperience,
  createEducationExperiences,
  updateEducationExperience,
  deleteEducationExperience,
  findOneByUserId,
}
