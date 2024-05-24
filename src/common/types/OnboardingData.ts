export type OnboardingData = {
  id: string
  responses: {
    experience: {
      response: {
        company: string
        position: string
        startDate: string
        current: boolean
        endDate: string
        description: string
      }[]
    }
    name: {
      response: {
        firstName: string
        lastName: string
        phoneNumber: string
      }
    }

    trainingProvider: {
      response: string[]
    }

    education: {
      response: {
        org: string
        title: string

        gradYear: string
        gpa: string
        activities: string
      }[]
    }
    other: {
      response?: {
        activity: string
        startDate: string
        endDate: string
        learning: string
      }[]
    }
    opportunityInterests: {
      response: string[]
    }
    reliability: {
      response: string[]
    }
  }
  completedAt: string
}

export type OnboardingNextStep =
  'loading' |
  'start' |
  'reliability' |
  'employment' |
  "education" |
  'training' |
  'opportunities' |
  'complete_loading' |
  'complete'
