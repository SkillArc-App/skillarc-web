import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const createLearnedSkill = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { masterSkillId, jobId } = body

  const learnedSkill = await prisma.learnedSkill.create({
    data: {
      master_skill_id: masterSkillId,
      job_id: jobId,
    },
  })

  return res.status(200).json(learnedSkill)
}

export const deleteLearnedSkill = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const learnedSkill = await prisma.learnedSkill.delete({
    where: {
      id,
    },
  })

  return res.status(200).json(learnedSkill)
}
