import { prisma } from '../db/client'

// const findOne = async (id: string) => {
//   return await prisma.profile.findUnique({
//     where: {
//       id: id,
//     },
//     include: {
//       user: true,
//       credentials: true,
//       desiredOutcomes: true,
//       educationExperiences: true,
//       networkInterests: true,
//       onboardingSession: true,
//       otherExperiences: true,
//       preferences: true,
//       professionalInterests: true,
//     },
//   })
// }

// const update = async (id: string, data: any) => {
//   return await prisma.profile.update({
//     where: {
//       id: id,
//     },
//     data: {
//       ...data,
//       desiredOutcomes: {
//         create: data.desiredOutcomes,
//       },
//       networkInterests: {
//         create: data.networkInterests,
//       },
//       professionalInterests: {
//         create: data.professionalInterests,
//       },
//       preferences: {
//         create: data.preferences,
//       },
//       educationExperiences: {
//         create: data.experiences,
//       },
//     },
//   })
// }

const create = async (
  data: {
    organizationId: string
    organization_name: string
    profile_id: string
    start_date: string
    is_current: boolean
    end_date: string
    description: string
    position: string
  },
  profileId: string,
) => {
  return await prisma.otherExperience.create({
    data: { ...data, profile_id: profileId },
  })
}

// const findMany = async () => {
//   return await prisma.profile.findMany()
// }

export const APIOtherExperiencesService = {
  //   findOne,
  //   update,
  //   findMany,
  create,
}
