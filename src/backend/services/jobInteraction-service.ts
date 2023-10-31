import { JobInteraction } from '@prisma/client'
import { prisma } from '../db/client'

const findOne = async (id: string) => {
  return await prisma.jobInteraction.findUnique({
    where: {
      id: id,
    },
  })
}

const update = async (jobInteractionId: string, data: JobInteraction) => {
  return await prisma.jobInteraction.update({
    where: {
      id: jobInteractionId,
    },
    data: data,
  })
}

const updateManyTempInteractions = async (userId: string, tempUserId: string) => {
  return await prisma.jobInteraction.updateMany({
    where: {
      user_id: tempUserId,
    },
    data: {
      user_id: userId,
    },
  })
}

const create = async (data: {
  jobId: string
  userId: string
  hasViewed?: boolean
  percentMatch?: number
  intentToApply?: boolean
}) => {
  return await prisma.jobInteraction.create({
    data: {
      job_id: data.jobId,
      user_id: data.userId,
      has_viewed: data.hasViewed,
      percent_match: data.percentMatch,
      intent_to_apply: data.intentToApply,
    },
  })
}

export const APIJobInteractionService = {
  findOne,
  update,
  updateManyTempInteractions,
  create,
}
