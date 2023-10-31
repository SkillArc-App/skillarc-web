import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const createTestimonial = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { name, jobId, title, testimonial, photoUrl } = body

  const t = await prisma.testimonial.create({
    data: {
      job_id: jobId,
      name,
      title,
      testimonial,
      photo_url: photoUrl,
    },
  })

  return res.status(200).json(t)
}

export const deleteTestimonial = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const desiredSkill = await prisma.testimonial.delete({
    where: {
      id,
    },
  })

  return res.status(200).json(desiredSkill)
}
