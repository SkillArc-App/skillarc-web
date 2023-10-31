import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { getServerSession } from 'lib/auth-wrapper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const acceptNew = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: applicantId } = req.query

  const dbApplicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId as string,
    },
    include: {
      statuses: true,
    },
  })

  if (!dbApplicant) return res.status(404)

  await prisma.applicantStatus.create({
    data: {
      applicant_id: dbApplicant.id,
      status: 'pending intro',
    },
  })

  return res.status(200).json({ message: 'accepted' })
}

export const rejectNew = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: applicantId } = req.query

  const dbApplicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId as string,
    },
    include: {
      statuses: true,
    },
  })

  if (!dbApplicant) return res.status(404)

  await prisma.applicantStatus.create({
    data: {
      applicant_id: dbApplicant.id,
      status: 'pass',
    },
  })

  return res.status(200).json({ message: 'rejected' })
}

export const rejectInterviewee = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: applicantId } = req.query

  const dbApplicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId as string,
    },
    include: {
      statuses: true,
    },
  })

  if (!dbApplicant) return res.status(404)

  await prisma.applicantStatus.create({
    data: {
      applicant_id: dbApplicant.id,
      status: 'pass',
    },
  })

  return res.status(200).json({ message: 'rejected' })
}

export const acceptInterviewee = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: applicantId } = req.query

  const dbApplicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId as string,
    },
    include: {
      statuses: true,
    },
  })

  if (!dbApplicant) return res.status(404)

  await prisma.applicantStatus.create({
    data: {
      applicant_id: dbApplicant.id,
      status: 'offer',
    },
  })

  return res.status(200).json({ message: 'offer' })
}

export const updateApplicant = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const isAdmin = dbUser.userRoles.some((ur) => ur.role.name === 'admin')
  const isEmployer = prisma.recruiter.findFirst({
    where: {
      user_id: dbUser?.id,
    },
  })
  if (!isAdmin && !isEmployer) return res.status(401)

  const { id: applicantId } = req.query
  const { status } = req.body

  const dbApplicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId as string,
    },
    include: {
      statuses: true,
    },
  })

  if (!dbApplicant) return res.status(404)

  await prisma.applicantStatus.create({
    data: {
      applicant_id: dbApplicant.id,
      status,
    },
  })

  return res.status(200).json({ message: 'updated' })
}
