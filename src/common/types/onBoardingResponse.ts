export type onBoardingResponse = {
  id?: string
  responses?: {
    goal?: {
      question?: string
      response?: string[]
    }
    name?: {
      question?: string
      response?: {
        firstName?: string
        lastName?: string
        phoneNumber?: string
        dateOfBirth?: string
      }
    }
    reliability?: {
      question?: string
      response?: string[]
    }
    trainingProvider?: {
      question?: string
      response?: string[]
    }
    yourSituation?: {
      question?: string
      response?: string
    }
    blocktrainHelp?: {
      question?: string
      response?: string[]
    }
    zipcode?: {
      question?: string
      response?: string
    }
    infoConsent?: {
      question?: string
      response?: string
    }
    education?: {
      question?: string
      response?: {
        org?: string
        title?: string
        gradYear?: string
        gpa?: string
        activities?: string
      }[]
    }
    experience?: {
      question?: string
      response?: {
        company?: string
        position?: string
        startDate?: string
        current?: boolean
        endDate?: string
        description?: string
      }[]
    }
    other?: {
      question?: string
      response?: {
        activity: string
        startDate: string
        endDate: string
        learning: string
      }[]
    }
    technicalStrengths?: {
      question?: string
      response?: string[]
    }
    lifeExperiencesTechnical?: {
      question?: string
      response?: {
        technicalStrength?: string
        technicalStrengthDescription?: string
      }[]
    }
    personalStrengths?: {
      question?: string
      response?: string[]
    }
    lifeExperiencesPersonal?: {
      question?: string
      response?: {
        personalStrength?: string
        personalStrengthDescription?: string
      }[]
    }
    yourStory?: {
      question?: string
      response?: {
        prompt?: string
        response?: string
      }[]
    }
    additionalStory?: {
      question?: string
      response?: {
        selection?: string
        response?: string
      }
    }
    certifications?: {
      question?: string
      response?: string[]
    }
    getReady?: {
      question?: string
      response?: boolean
    }
    opportunityInterests?: {
      question?: string
      response?: string[]
    }
    accessNetwork?: {
      question?: string
      response?: string[]
    }
    allSet?: {
      question?: string
    }
  }
}
