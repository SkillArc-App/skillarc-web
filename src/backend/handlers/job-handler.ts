import { NextApiRequest, NextApiResponse } from 'next'
import { APIJobService } from '../services/job-service'
import { getServerSession } from 'lib/auth-wrapper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '../db/client'

export const getOneJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.jobId as string
  const job = await APIJobService.findOne(id)
  return res.status(200).json(job)
}

export const getAllJobs = async (req: NextApiRequest, res: NextApiResponse) => {
  const jobs = await APIJobService.findMany()
  res.status(200).json(jobs)
}

export const createPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIJobService.createPhoto(req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not create' })
  }
}

export const createJob = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIJobService.createOne(req.body)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const updateJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.jobId as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updatedJob = await APIJobService.updateOne(id, req.body)
  // if the job was updated, return 200
  if (updatedJob) {
    res.status(200).json(updatedJob)
  } else {
    res.status(400).json({ message: 'Could not update job' })
  }
}

export const deleteJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.jobId as string
  const job = await APIJobService.deleteOne(id)
  return res.status(200).json(job)
}

export const apply = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(403)

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      profile: true,
    },
  })

  if (!user?.profile) {
    return res.status(403)
  }

  const { query } = req
  const id = query.jobId as string
  const job = await APIJobService.apply({ jobId: id, profileId: user.profile.id })
  return res.status(200).json(job)
}
