import { OnboardingSession, Prisma } from '@prisma/client'
import { prisma } from '../db/client'
import { APIAnalyticsService } from './analytics-service'

type OnboardingUpdate = {
  desiredOutcomes: {
    profileId: string
    response: string
  }[]
  networkInterests: {
    profileId: string
    response: string
  }[]
  professionalInterests: {
    profileId: string
    response: string
  }[]
  preferences: {
    email_consent: Date
    information_consent: Date
    profile_id: string
  }[]
  experiences: {
    organization_id: string
    organization_name: string
    profile_id: string
    title: string
    activities: string
    graduation_date: string
    gpa: string
  }[]
  skills: {
    name: string
    type: string
    profile_id: string
    description: string
  }[]
  stories: {
    profile_id: string
    prompt: string
    response: string
  }[]
}

const onboardingUpdate = async (id: string, data: OnboardingUpdate) => {
  return await prisma.profile.update({
    where: {
      id: id,
    },
    data: {
      ...data,
      desiredOutcomes: {
        create: data.desiredOutcomes,
      },
      networkInterests: {
        create: data.networkInterests,
      },
      professionalInterests: {
        create: data.professionalInterests,
      },
      preferences: {
        create: data.preferences,
      },
      educationExperiences: {
        create: data.experiences,
      },
      skills: {
        create: data.skills,
      },
      stories: {
        create: data.stories,
      },
    },
  })
}

const updateOnboardingSession = async (
  userId: string,
  onboardingSessionId: string,
  data: Partial<OnboardingSession>,
) => {
  data = {
    ...data,
    user_id: userId,
    id: onboardingSessionId,
  }

  APIAnalyticsService.create({
    name: 'Onboarding Updated',
    properties: {
      distinct_id: userId,
      userId: userId,
      step: data.current_step,
    },
  })

  const responses = data.responses as Prisma.JsonObject

  return await prisma.onboardingSession.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
      responses: responses,
    },
  })
}

const getOnboardingSession = async (userId: string, onboardingSessionId: string) => {
  return await prisma.onboardingSession.findUnique({
    where: {
      id: onboardingSessionId,
    },
  })
}

const getOnboardingSessionBuUserId = async (userId: string) => {
  return await prisma.onboardingSession.findUnique({
    where: {
      user_id: userId,
    },
  })
}

export const APIOnboardingService = {
  onboardingUpdate,
  updateOnboardingSession,
  getOnboardingSession,
  getOnboardingSessionBuUserId,
}
