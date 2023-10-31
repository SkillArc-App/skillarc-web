import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { getServerSession } from 'lib/auth-wrapper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  const tp = await prisma.program.findMany()

  return res.status(200).json(tp)
}

export const getProgramsForTrainingProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) return res.status(403)

  const trainingProviderProfile = await prisma.trainingProviderProfile.findFirst({
    where: {
      user_id: session.user.id,
    },
  })

  if (!trainingProviderProfile) return res.status(403)

  const programs = await prisma.program.findMany({
    where: {
      training_provider_id: trainingProviderProfile.training_provider_id,
    },
  })

  return res.status(200).json(programs)
}

export const getProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  const { programId } = req.query

  const program = await prisma.program.findUnique({
    where: {
      id: programId as string,
    },
    include: {
      trainingProvider: true,
    },
  })

  return res.status(200).json(program)
}

export const updateProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  const { programId } = req.query
  const { name, description, trainingProviderId } = req.body

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

  if (!dbUser) return res.status(403)
  if (!dbUser.userRoles.some((ur) => ur.role.name === 'admin')) return res.status(403)

  const tp = await prisma.program.update({
    where: {
      id: programId as string,
    },
    data: {
      name,
      description,
      training_provider_id: trainingProviderId,
    },
  })

  return res.status(200).json(tp)
}

export const createProgram = async (req: NextApiRequest, res: NextApiResponse) => {
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

  if (!dbUser) return res.status(403)
  if (!dbUser.userRoles.some((ur) => ur.role.name === 'admin')) return res.status(403)

  const { name, description, trainingProviderId } = req.body

  const program = await prisma.program.create({
    data: {
      name,
      description,
      training_provider_id: trainingProviderId,
    },
  })

  return res.status(200).json(program)
}
