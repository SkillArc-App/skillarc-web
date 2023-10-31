import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { SeekerInvite } from '@prisma/client'

export const createTrainingProviderInvites = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) return res.status(403)

  const trainingProviderProfile = await prisma.trainingProviderProfile.findFirst({
    where: {
      user_id: session.user.id,
    },
  })

  if (!trainingProviderProfile) return res.status(403)

  const { invitees } = req.body as {
    invitees: SeekerInvite[]
  }

  const invites = await prisma.seekerInvite.createMany({
    data: invitees.map((i) => ({
      email: i.email,
      first_name: i.first_name,
      last_name: i.last_name,
      training_provider_id: trainingProviderProfile.training_provider_id,
      program_id: i.program_id,
    })),
  })

  return res.status(200).json(invites)
}

export const getTrainingProviderInvites = async (req: NextApiRequest, res: NextApiResponse) => {
  const providerInvites = await prisma.trainingProviderInvite.findMany({
    include: {
      trainingProvider: true,
    },
  })

  const prefix = process.env.NEXT_PUBLIC_ENVIRONMENT_URL

  const ti = providerInvites.map((pi) => ({
    id: pi.id,
    email: pi.email,
    firstName: pi.first_name,
    lastName: pi.last_name,
    trainingProviderName: pi.trainingProvider.name,
    usedAt: pi.used_at?.toLocaleDateString(),
    link: `${prefix}/invites/trainingProviders/${pi.id}`,
  }))

  return res.status(200).json(ti)
}
