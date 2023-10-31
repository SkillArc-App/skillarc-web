import { prisma } from '../db/client'

const createOne = async (data: {
  authorProfileId: string
  referenceText: string
  seekerProfileId: string
  trainingProviderId: string
}) => {
  return await prisma.reference.create({
    data: {
      author_profile_id: data.authorProfileId,
      reference_text: data.referenceText,
      seeker_profile_id: data.seekerProfileId,
      training_provider_id: data.trainingProviderId,
    },
  })
}

const findOne = async (id: string) => {
  return await prisma.reference.findUnique({
    where: {
      id,
    },
  })
}

const updateOne = async (
  id: string,
  data: {
    authorProfileId: string
    referenceText: string
    seekerProfileId: string
    trainingProviderId: string
  },
) => {
  return await prisma.reference.update({
    where: {
      id,
    },
    data: {
      author_profile_id: data.authorProfileId,
      reference_text: data.referenceText,
      seeker_profile_id: data.seekerProfileId,
      training_provider_id: data.trainingProviderId,
    },
  })
}

export const APIReferenceService = {
  createOne,
  findOne,
  updateOne,
}
