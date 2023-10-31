import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { getServerSession } from 'lib/auth-wrapper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getTrainingProviders = async (req: NextApiRequest, res: NextApiResponse) => {
  const tp = await prisma.trainingProvider.findMany()

  return res.status(200).json(tp)
}

export const getTrainingProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  const { trainingProviderId } = req.query

  const tp = await prisma.trainingProvider.findUnique({
    where: {
      id: trainingProviderId as string,
    },
    include: {
      program: true,
    },
  })

  return res.status(200).json(tp)
}

export const createTrainingProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  // return unauthorized if not admin
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

  const { name, description } = req.body

  const tp = await prisma.trainingProvider.create({
    data: {
      name,
      description,
    },
  })

  return res.status(200).json(tp)
}
