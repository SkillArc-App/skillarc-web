import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { getServerSession } from 'lib/auth-wrapper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getEmployerJobs = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(req, res, authOptions)) as any

  if (!session?.user?.id) return res.status(403)

  // Not sure why I can't get the user type from the session
  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      recruiter: true,
    },
  })
  const employerId = dbUser?.recruiter?.at(0)?.employer_id

  if (!employerId) {
    return res.status(401)
  }

  const dbJobs = await prisma.job.findMany({
    where: {
      employer_id: employerId,
    },
  })

  const jobs = dbJobs.map((job) => ({
    id: job.id,
    name: job.employment_title,
    description: "descriptions don't exist yet",
  }))

  const dbApplicants = await prisma.applicant.findMany({
    where: {
      job: { employer_id: employerId },
    },
    include: {
      job: true,
      statuses: true,
      profile: {
        include: {
          user: true,
        },
      },
    },
  })

  const applicants = dbApplicants.map((applicant) => {
    return {
      id: applicant.id,
      jobId: applicant.job_id,
      jobName: applicant.job.employment_title,
      firstName: applicant.profile.user.first_name,
      lastName: applicant.profile.user.last_name,
      profileLink: `/profiles/${applicant.profile_id}`,
      status: applicant.statuses
        .sort((a, b) => {
          return b.created_at.getTime() - a.created_at.getTime()
        })
        ?.at(0)?.status,
      programs: [],
    }
  })

  return res.status(200).json({ jobs, applicants })
}
