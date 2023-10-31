import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const createJobPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { photoUrl, jobId } = body

  const jobPhoto = await prisma.jobPhoto.create({
    data: {
      photo_url: photoUrl,
      job_id: jobId,
    },
  })

  return res.status(200).json(jobPhoto)
}

export const deleteJobPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
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

  await prisma.jobPhoto.delete({
    where: {
      id,
    },
  })
}
