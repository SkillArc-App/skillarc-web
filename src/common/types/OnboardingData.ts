export type OnboardingData = {
  id: string
  responses: {
    experience: {
      question: string
      response: {
        company: string
        position: string
        startDate: string
        current: boolean
        endDate: string
        description: string
      }[]
    }
    goal: {
      question: string
      response: string[]
    }
    name: {
      question: string
      response: {
        firstName: string
        lastName: string
        phoneNumber: string
      }
    }

    trainingProvider: {
      question: string
      response: string[]
    }

    education: {
      question: string
      response: {
        org: string
        title: string

        gradYear: string
        gpa: string
        activities: string
      }[]
    }
    other: {
      question?: string
      response?: {
        activity: string
        startDate: string
        endDate: string
        learning: string
      }[]
    }
    opportunityInterests: {
      question: string
      response: string[]
    }
    reliability: {
      question: string
      response: string[]
    }
  }
  startedAt: Date
  completedAt: Date
}
