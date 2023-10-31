import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { APIStudentService } from '../services/student-service'
import { getServerSession } from 'lib/auth-wrapper'
import { prisma } from '../db/client'

export const getStudents = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(req, res, authOptions)) as any

  if (!session?.user?.id) return res.status(403)

  // Not sure why I can't get the user type from the session
  const userType = (
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
  )?.user_type

  if (userType !== 'TRAINING_PROVIDER') return res.status(403)

  const user = session.user

  const students = await APIStudentService.findFor(user.id)

  return res.status(200).json(students)
}

export const updateStudent = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(req, res, authOptions)) as any

  if (!session?.user?.id) return res.status(403)

  const userType = (
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
  )?.user_type

  if (userType !== 'TRAINING_PROVIDER') return res.status(403)

  const { programId, studentId } = req.query

  const { status } = req.body

  const student = await prisma.profile.findUnique({
    where: {
      id: studentId as string,
    },
  })

  if (!student) return res.status(404)

  const seekerTrainingProvider = await prisma.seekerTrainingProvider.findFirst({
    where: {
      user_id: student.user_id,
      program_id: programId as string,
    },
  })

  if (!seekerTrainingProvider) return res.status(404)

  const newStatus = await prisma.seeker_training_provider_program_statuses.create({
    data: {
      seeker_training_provider_id: seekerTrainingProvider.id,
      status,
    },
  })

  return res.status(200).json(newStatus)
}
