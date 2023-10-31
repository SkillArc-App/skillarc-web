import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const createCareerPath = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { title, lowerLimit, upperLimit, jobId } = body

  const highestOrder = await prisma.careerPath.findFirst({
    orderBy: {
      order: 'desc',
    },
    where: {
      job_id: jobId,
    },
  })

  const order = highestOrder ? highestOrder.order + 1 : 0

  const data = {
    title,
    lowerLimit,
    upperLimit,
    jobId,
    order,
  }

  const created = await prisma.careerPath.create({
    data: {
      title,
      order,
      lower_limit: lowerLimit,
      upper_limit: upperLimit,
      job_id: jobId,
    },
  })

  return res.status(200).json(created)
}

export const deleteCareerPath = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const cp = await prisma.careerPath.findUnique({
    where: {
      id,
    },
  })

  if (!cp) return res.status(404)

  const jobPaths = await prisma.careerPath.findMany({
    where: {
      job_id: cp.job_id,
    },
    orderBy: {
      order: 'asc',
    },
  })

  // get index of cp
  const index = jobPaths.findIndex((jp) => jp.id === cp.id)

  // decrement the order of every path after the deleted path
  for (let i = index + 1; i < jobPaths.length; i++) {
    const jp = jobPaths[i]
    await prisma.careerPath.update({
      where: {
        id: jp.id,
      },
      data: {
        order: jp.order - 1,
      },
    })
  }

  await prisma.careerPath.delete({
    where: {
      id,
    },
  })

  return res.status(200).json({ message: 'Hello world!' })
}

export const movePathUp = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const dbPath = await prisma.careerPath.findUnique({
    where: {
      id,
    },
  })

  if (!dbPath) return res.status(404)
  if (dbPath.order === 0) return res.status(200).json({ message: 'Already at top' })

  const dbPathAbove = await prisma.careerPath.findFirst({
    where: {
      order: dbPath.order - 1,
      job_id: dbPath.job_id,
    },
  })

  if (!dbPathAbove) return res.status(404)

  await prisma.careerPath.update({
    where: {
      id,
    },
    data: {
      order: dbPath.order - 1,
    },
  })

  await prisma.careerPath.update({
    where: {
      id: dbPathAbove.id,
    },
    data: {
      order: dbPath.order,
    },
  })

  return res.status(200).json({ message: 'Hello world!' })
}

export const movePathDown = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const dbPath = await prisma.careerPath.findUnique({
    where: {
      id,
    },
  })

  if (!dbPath) return res.status(404)

  const dbPathBelow = await prisma.careerPath.findFirst({
    where: {
      order: dbPath.order + 1,
      job_id: dbPath.job_id,
    },
  })

  if (!dbPathBelow) return res.status(404)

  await prisma.careerPath.update({
    where: {
      id,
    },
    data: {
      order: dbPath.order + 1,
    },
  })

  await prisma.careerPath.update({
    where: {
      id: dbPathBelow.id,
    },
    data: {
      order: dbPath.order,
    },
  })

  return res.status(200).json({ message: 'Hello world!' })
}
