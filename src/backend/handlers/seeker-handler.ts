import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const addTraininerProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  })
  if (!dbUser?.userRoles.some((ur) => ur.role.name === 'admin')) return res.status(401)

  const { programId, trainingProviderId } = req.body
  const profileId = req.query.seekerId as string

  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  })

  const userId = profile?.user_id as string

  const data = {
    user_id: userId,
    program_id: programId,
    training_provider_id: trainingProviderId,
  }

  const stp = await prisma.seekerTrainingProvider.create({
    data,
  })

  return res.status(200).json(stp)
}

export const updateTrainingProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  })
  if (!dbUser?.userRoles.some((ur) => ur.role.name === 'admin')) return res.status(401)

  const { programId, trainingProviderId } = req.body
  const profileId = req.query.seekerId as string

  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  })

  const userId = profile?.user_id as string

  const data = {
    user_id: userId,
    program_id: programId,
    training_provider_id: trainingProviderId,
  }

  const stp = await prisma.seekerTrainingProvider.findFirst({
    where: { user_id: userId },
  })

  if (stp) {
    await prisma.seekerTrainingProvider.update({
      where: {
        id: stp.id,
      },
      data,
    })
  } else {
    return res.status(200)
  }

  return res.status(200).json(stp)
}
