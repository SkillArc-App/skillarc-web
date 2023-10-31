import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'lib/auth-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../db/client'
import { EducationExperience } from '@/common/types/EducationExperience'
import { OtherExperience } from '@/common/types/OtherExperience'
import { ProfessionalInterests } from '@/common/types/Profile'
import { OnboardingData } from '@/common/types/OnboardingData'

export const createOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user?.id

  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const dbOnboardingSession = await prisma.onboardingSession.findUnique({
    where: {
      user_id: userId,
    },
  })

  if (dbOnboardingSession) return res.status(200).json(dbOnboardingSession)

  const r = await prisma.onboardingSession.create({
    data: {
      user_id: userId,
      started_at: new Date(),
    },
  })

  return res.status(200).json(r)
}

const onboardingComplete = (
  reliability: string[] | undefined,
  request: {
    education: {
      response: {
        org?: string
        title?: string
        gradYear?: string
        gpa?: string
        activities?: string
      }[]
    }
    experience:
      | {
          response: {
            company?: string
            position?: string
            startDate?: string
            current?: boolean
            endDate?: string
            description?: string
          }[]
        }
      | undefined
    other:
      | {
          response: {
            activity: string
            startDate: string
            endDate: string
            learning: string
          }[]
        }
      | undefined
    opportunityInterests: { response: string[] } | undefined
    trainingProvider: { response: string[] } | undefined
  },
) => {
  if (!reliability) return false
  if (!((request.opportunityInterests?.response.length ?? 0) > 0)) return false

  const reliable = reliability.every((r) => {
    if (
      r === "I've had or currently have a job" &&
      (request.experience?.response.length ?? 0 > 0)
    ) {
      return true
    }

    if (r === 'I have a High School Diploma / GED' && (request.education?.response.length ?? 0 > 0))
      return true

    if (
      r === "I've attended a Training Program" &&
      (request.trainingProvider?.response.length ?? 0 > 0)
    ) {
      return true
    }
    if (
      r === "I have other experience I'd like to share" &&
      (request.other?.response.length ?? 0 > 0)
    ) {
      return true
    }

    return false
  })
  return reliable
}

export const updateOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user?.id

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  })

  if (!user?.id) return res.status(401).json({ message: 'Unauthorized' })

  const onboardingSessionId = req.body.id as string

  const dbOnboardingSession = await prisma.onboardingSession.findUnique({
    where: {
      id: onboardingSessionId,
    },
  })

  if (!dbOnboardingSession) return res.status(404).json({ message: 'Not found' })

  if (req.body.responses?.name) {
    const { firstName, lastName } = req.body.responses.name.response

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    })
  }

  if (req.body.responses?.name && !user.profile) {
    await prisma.profile.upsert({
      where: {
        user_id: user.id,
      },
      create: {
        user_id: user.id,
      },
      update: {
        user_id: user.id,
      },
    })
  }

  if (req.body.responses?.education && user.profile?.id) {
    const data = req.body.responses.education.response.map((r: any) => {
      return {
        organizationName: r.org,
        title: r.title,
        activities: r.activities,
        graduationDate: r.gradYear,
        gpa: r.gpa,
        profileId: user.profile?.id,
      }
    })

    data.forEach(async (d: EducationExperience) => {
      const existing = await prisma.educationExperience.findMany({
        where: {
          organization_id: d.organizationId,
          organization_name: d.organizationName,
          profile_id: d.profileId ?? '',
          title: d.title,
          activities: d.activities,
          graduation_date: d.graduationDate,
          gpa: d.gpa ?? '',
        },
      })

      if (!existing.at(0)) {
        await prisma.educationExperience.create({
          data: {
            organization_id: d.organizationId,
            organization_name: d.organizationName,
            profile_id: d.profileId ?? '',
            title: d.title,
            activities: d.activities,
            graduation_date: d.graduationDate,
            gpa: d.gpa ?? '',
          },
        })
      }
    })
  }

  if (req.body.responses?.experience && user.profile?.id) {
    const experience = req.body.responses?.experience

    const data = experience.response.map((r: any) => {
      return {
        organizationName: r.company,
        position: r.position,
        startDate: r.startDate,
        endDate: r.endDate,
        isCurrent: r.current,
        description: r.description,
        profileId: user.profile?.id,
      }
    })

    data.forEach(async (d: OtherExperience) => {
      const existing = await prisma.otherExperience.findMany({
        where: {
          organization_id: d.organizationId,
          organization_name: d.organizationName,
          profile_id: d.profileId ?? '',
          start_date: d.startDate,
          is_current: d.isCurrent,
          end_date: d.endDate,
          description: d.description,
          position: d.position,
        },
      })

      if (!existing.at(0)) {
        await prisma.otherExperience.create({
          data: {
            organization_id: d.organizationId,
            organization_name: d.organizationName,
            profile_id: d.profileId ?? '',
            start_date: d.startDate,
            is_current: d.isCurrent,
            end_date: d.endDate,
            description: d.description,
            position: d.position,
          },
        })
      }
    })
  }

  if (req.body.responses?.opportunityInterests && user.profile?.id) {
    const professionalInterests = req.body.responses?.opportunityInterests as any

    const data = professionalInterests.response.map((r: any) => {
      return {
        profileId: user.profile?.id,
        response: r,
      }
    })

    data.forEach(async (d: ProfessionalInterests) => {
      const existing = await prisma.professionalInterests.findMany({
        where: {
          profile_id: d.profileId,
          response: d.response,
        },
      })

      if (!existing.at(0)) {
        await prisma.professionalInterests.create({
          data: {
            profile_id: d.profileId,
            response: d.response,
          },
        })
      }
    })
  }

  if (req.body.responses?.trainingProvider && user.profile?.id) {
    const trainingProvider = req.body.responses?.trainingProvider.response as string[]

    trainingProvider.forEach(async (t) => {
      const existing = await prisma.seekerTrainingProvider.findMany({
        where: {
          user_id: user.id,
          training_provider_id: t,
        },
      })

      if (!existing.at(0)) {
        await prisma.seekerTrainingProvider.create({
          data: {
            user_id: user.id,
            training_provider_id: t,
          },
        })
      }
    })
  }

  if (req.body.responses?.other && user.profile?.id) {
    const otherExperiences = req.body.responses?.other as any

    const data = otherExperiences.response.map((r: any) => {
      return {
        profile_id: user.profile?.id,
        activity: r.activity,
        description: r.learning,
        start_date: r.startDate,
        end_date: r.endDate,
      }
    })

    data.forEach(async (d: any) => {
      const existing = await prisma.personalExperience.findMany({
        where: { ...d },
      })

      if (!existing.at(0)) {
        await prisma.personalExperience.create({
          data: d,
        })
      }
    })
  }

  const reliability = req.body.responses?.reliability as any

  const isOnboardingComplete = onboardingComplete(reliability?.response, req.body.responses)

  const r = await prisma.onboardingSession.update({
    where: {
      id: onboardingSessionId,
    },
    data: {
      ...req.body,
      completed_at: isOnboardingComplete ? new Date() : undefined,
    },
  })

  return res.status(200).json(r)
}

export const getOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user?.id

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const dbOnboardingSession = await prisma.onboardingSession.findUnique({
    where: {
      user_id: userId,
    },
  })

  if (!dbOnboardingSession) return res.status(200).json({})

  const onboardingData = {
    id: dbOnboardingSession.id,
    responses: dbOnboardingSession.responses,

    startedAt: dbOnboardingSession.started_at,
    completedAt: dbOnboardingSession.completed_at,
  }

  return res.status(200).json(onboardingData)
}
