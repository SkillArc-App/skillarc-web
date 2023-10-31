import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const getEmployer = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string

  const employer = await prisma.employer.findUnique({
    where: {
      id,
    },
  })

  return res.status(200).json(employer)
}

export const updateEmployer = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string

  const { name, logoUrl, bio, location } = req.body

  const employer = await prisma.employer.update({
    where: {
      id,
    },
    data: {
      name,
      logo_url: logoUrl,
      bio,
      location,
    },
  })

  return res.status(200).json(employer)
}

export const getEmployers = async (req: NextApiRequest, res: NextApiResponse) => {
  const employers = await prisma.employer.findMany()

  return res.status(200).json(employers)
}

export const createEmployer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, logoUrl, bio, location } = req.body

  const employer = await prisma.employer.create({
    data: {
      name,
      logo_url: logoUrl,
      bio,
      location,
    },
  })

  return res.status(200).json(employer)
}
