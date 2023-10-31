import { prisma } from '../db/client'

export default async function hiringStatus(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
    include: {
      applicants: {
        include: {
          statuses: true,
        },
      },
    },
  })
  // throw an error if profile is not found
  if (!profile) throw new Error(`Profile not found for id ${profileId}`)

  // Hired
  // TODO

  // Interviewing
  if (
    profile.applicants.some((a) => {
      const status = a.statuses.sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1
      })[0].status

      if (status === 'interviewing') return true
    })
  )
    return 'Interviewing'

  // Applying to jobs
  if (profile.applicants.length > 0) return 'Applying to jobs'

  // Profile Complete
  return 'Profile Complete'
}
