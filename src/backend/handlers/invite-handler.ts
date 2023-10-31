import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const connectInvite = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const trainingProviderInviteCode = body.trainingProviderInviteCode
  const seekerInviteCode = body.seekerInviteCode
  const employerInviteCode = body.employerInviteCode

  if (seekerInviteCode) {
    const invite = await prisma.seekerInvite.findUnique({
      where: {
        id: seekerInviteCode,
      },
    })

    if (!invite) return res.status(403)

    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user?.id as string

    if (invite.email !== session?.user?.email) return res.status(403)
    if (invite.used_at !== null) return res.status(200).json({ message: 'Success' })

    const data = {
      user_id: userId,
      program_id: invite.program_id,
      training_provider_id: invite.training_provider_id,
    }

    const oldSp = await prisma.seekerTrainingProvider.findFirst({
      where: data,
    })

    if (oldSp) {
      return res.status(200).json({ message: 'Success' })
    }

    await prisma.seekerTrainingProvider.create({
      data,
    })

    await prisma.seekerInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        used_at: new Date(),
      },
    })

    return res.status(200).json({ message: 'Success' })
  }

  if (trainingProviderInviteCode) {
    const invite = await prisma.trainingProviderInvite.findUnique({
      where: {
        id: trainingProviderInviteCode,
      },
    })

    if (!invite) return res.status(403)

    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user?.id as string

    if (invite.email !== session?.user?.email) return res.status(403)
    if (invite.used_at !== null) return res.status(200).json({ message: 'Success' })

    const data = {
      user_id: userId,
      training_provider_id: invite.training_provider_id,
    }

    const oldTpp = await prisma.trainingProviderProfile.findFirst({
      where: data,
    })

    if (oldTpp) {
      return res.status(200).json({ message: 'Success' })
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        user_type: 'TRAINING_PROVIDER',
      },
    })

    await prisma.trainingProviderProfile.create({
      data,
    })

    await prisma.trainingProviderInvite.update({
      where: {
        id: trainingProviderInviteCode as string,
      },
      data: {
        used_at: new Date(),
      },
    })

    return res.status(200).json({ message: 'Success' })
  }

  if (employerInviteCode) {
    const invite = await prisma.employerInvite.findUnique({
      where: {
        id: employerInviteCode,
      },
    })

    if (!invite) return res.status(403)

    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user?.id as string

    if (invite.email !== session?.user?.email) return res.status(403)

    const data = {
      user_id: userId,
      employer_id: invite.employer_id,
    }

    const oldRecruiter = await prisma.recruiter.findFirst({
      where: {
        ...data,
      },
    })

    if (oldRecruiter) return res.status(200).json({ message: 'Success' })

    await prisma.recruiter.create({
      data,
    })
    await prisma.employerInvite.update({
      where: {
        id: employerInviteCode as string,
      },
      data: {
        used_at: new Date(),
      },
    })

    return res.status(200).json({ message: 'Success' })
  }
}

export const createTrainingProviderInvite = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { body } = req
  const { email, firstName, lastName, roleDescription, trainingProviderId } = body

  const data = {
    email,
    first_name: firstName,
    last_name: lastName,
    role_description: roleDescription,
    training_provider_id: trainingProviderId,
  }

  const tpi = await prisma.trainingProviderInvite.create({
    data,
  })

  return res.status(200).json(tpi)
}

export const createEmployerInvite = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { body } = req

  const { email, firstName, lastName, employerId } = body

  const data = {
    email,
    first_name: firstName,
    last_name: lastName,
    employer_id: employerId,
  }

  const ei = await prisma.employerInvite.create({
    data,
  })

  return res.status(200).json(ei)
}

export const createInvite = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { body } = req
  const { email, firstName, lastName, trainingProviderId, programId } = body

  const si = await prisma.seekerInvite.create({
    data: {
      email,
      first_name: firstName,
      last_name: lastName,
      training_provider_id: trainingProviderId,
      program_id: programId,
    },
  })

  return res.status(200).json(si)
}

export const getInvites = async (req: NextApiRequest, res: NextApiResponse) => {
  const seekerInvites = await prisma.seekerInvite.findMany({
    include: { trainingProvider: true, program: true },
  })

  // get the url for the current environment
  const prefix = process.env.NEXT_PUBLIC_ENVIRONMENT_URL

  const si = seekerInvites.map((invite) => {
    return {
      seekerType: 'SEEKER',
      email: invite.email,
      link: `${prefix}/invites/seekers/${invite.id}`,
      usedAt: invite.used_at,
      firstName: invite.first_name,
      lastName: invite.last_name,
      programName: invite.program.name,
      trainingProviderName: invite.trainingProvider.name,
    }
  })
  return res.status(200).json(si)
}
