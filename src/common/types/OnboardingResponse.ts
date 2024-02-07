export type OnboardingResponse = {
  id?: string
  responses?: AllResponses
}

export type AllResponses = NameResponse &
  ReliabilityResponse &
  TrainingProviderResponse &
  EducationResponse &
  ExperienceResponse &
  OtherExperienceResponse &
  OpportunityInterestsResponse

export type EducationResponse = {
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
}

export type ExperienceResponse = {
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
}

export type NameResponse = {
  name?: {
    question?: string
    response?: {
      firstName?: string
      lastName?: string
      phoneNumber?: string
      dateOfBirth?: string
    }
  }
}

export type OpportunityInterestsResponse = {
  opportunityInterests?: {
    question?: string
    response?: string[]
  }
}

export type OtherExperienceResponse = {
  other?: {
    question?: string
    response?: {
      activity: string
      startDate: string
      endDate: string
      learning: string
    }[]
  }
}

export type ReliabilityResponse = {
  reliability?: {
    question?: string
    response?: string[]
  }
}

export type TrainingProviderResponse = {
  trainingProvider?: {
    question?: string
    response?: string[]
  }
}
