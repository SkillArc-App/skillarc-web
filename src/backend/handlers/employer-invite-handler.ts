import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'

export const getEmployerInvites = async (req: NextApiRequest, res: NextApiResponse) => {
  const employerInvites = await prisma.employerInvite.findMany({
    include: {
      employer: true,
    },
  })

  const prefix = process.env.NEXT_PUBLIC_ENVIRONMENT_URL

  return res.status(200).json(
    employerInvites.map((ei) => ({
      id: ei.id,
      email: ei.email,
      firstName: ei.first_name,
      lastName: ei.last_name,
      trainingProviderName: ei.employer.name,
      usedAt: ei.used_at?.toLocaleDateString(),
      link: `${prefix}/invites/employers/${ei.id}`,
    })),
  )
}
