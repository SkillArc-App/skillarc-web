import mixpanel from 'mixpanel-browser'
import { GetOneProfileResponse } from '../services/profile.service'
import { FullUser } from '../services/user.service'

const isProduction = process.env.NEXT_PUBLIC_ENV === 'prod'

export const initializeMixpanel = () => {
  if (!isProduction) return

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '')
}

// identify user and set basic user info
export const mixpanelInitUser = (user: FullUser) => {
  if (!isProduction) return

  mixpanel.identify(user.id)
  let mixpanelPerson: any = {
    $email: user.email,
    $first_name: user.firstName,
    $last_name: user.lastName,
  }
  if (user.profile) {
    mixpanelPerson['$profile'] = user.profile
    if (user.profile.desiredOutcomes) {
      let responses: string[] = []
      user.profile.desiredOutcomes.forEach((outcome) => {
        if (outcome.response) {
          responses.push(outcome.response)
        }
      })
      mixpanelPerson['$desired_outcomes_responses'] = responses
    }
    if (user.profile.professionalInterests) {
      let responses: string[] = []
      user.profile.professionalInterests.forEach((interest) => {
        if (interest.response) {
          responses.push(interest.response)
        }
      })
      mixpanelPerson['$professional_interests_responses'] = responses
    }
  }
  mixpanel.people.set(mixpanelPerson)
}

export const mixpanelInitProfile = (profile: GetOneProfileResponse) => {
  if (!isProduction) return

  let desiredOutcomes: any[] = []
  let interests: string[] = []
  mixpanel.identify(profile.id)

  if (profile.desiredOutcomes) {
    profile.desiredOutcomes.forEach((outcome) => {
      if (outcome.response && desiredOutcomesVars[outcome.response]) {
        desiredOutcomes.push(desiredOutcomesVars[outcome.response])
      }
    })
  }
  if (profile.professionalInterests) {
    profile.professionalInterests.forEach((interest) => {
      if (interest.response && interestsVars[interest.response]) {
        interests.push(interestsVars[interest.response])
      }
    })
  }
  let mixpanelProps: any = {}
  desiredOutcomes.forEach((outcome: string) => {
    mixpanelProps[outcome] = true
  })
  interests.forEach((interest: string) => {
    mixpanelProps[interest] = true
  })
  mixpanel.people.set(mixpanelProps)
}

const desiredOutcomesVars: any = {
  'Find job opportunities': 'find_job_opportunities',
  'Find training programs': 'find_training_programs',
  'Exploring new career paths': 'exploring_new_career_paths',
  'Find local services': 'find_local_services',
}
const interestsVars: any = {
  'Construction training and jobs': 'construction',
  'Manufacturing training and jobs': 'manufacturing',
  'Healthcare training and jobs': 'healthcare',
  'Trade school scholarships': 'trade_school_scholarships',
  'Discovering your interests': 'discovering_your_interests',
  'Jobs with no previous experience required': 'no_previous_experience_required',
  'Job opportunities that offer transportation assistance': 'offer_transportation_assistance',
  'Job opportunities that offer housing assistance': 'offer_housing_assistance',
  'Jobs opportunities that offer assistance with childcare': 'offer_assistance_with_childcare',
  'Job opportunities for formerly incarcerated individuals':
    'opportunities_for_formerly_incarcerated_individuals',
}
