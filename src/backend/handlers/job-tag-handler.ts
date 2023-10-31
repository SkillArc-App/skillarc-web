import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const createJobTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const user = session?.user
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
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

  const { tag, jobId } = body

  const dbTag = await prisma.tag.findFirst({
    where: {
      name: tag,
    },
  })

  if (!dbTag) return res.status(400).json({ message: 'Tag not found' })

  const jobTag = await prisma.jobTag.create({
    data: {
      tag_id: dbTag.id,
      job_id: jobId,
    },
  })

  return res.status(200).json(jobTag)
}

export const deleteJobTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const user = session?.user
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
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

  const { query } = req
  const id = query.id as string

  const jobTag = await prisma.jobTag.delete({
    where: {
      id,
    },
  })

  return res.status(200).json(jobTag)
}
