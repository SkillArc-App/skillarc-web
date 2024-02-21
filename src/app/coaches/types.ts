import { Barrier } from '@/frontend/hooks/useBarrierData'

export type SeekerNote = {
  note: string
  noteTakenBy: string
  date: string
  noteId: string
}

export type SeekerLead = {
  leadId: string
  email?: string
  phoneNumber: string
  firstName: string
  lastName: string
  leadCapturedAt: string
  leadCapturedBy: string
  status: string
}

export type SubmittableSeekerLead = Pick<
  SeekerLead,
  'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'leadId'
>

export type SeekerApplication = {
  status: string
  employerName: string
  jobId: string
  employmentTitle: string
}

export type CoachSeeker = {
  applications: SeekerApplication[]
  assignedCoach: string
  barriers: Barrier[]
  certifiedBy?: string,
  email: string
  jobRecommendations: string[]
  firstName: string
  lastActiveOn: string
  lastContacted: string
  lastName: string
  notes: SeekerNote[]
  phoneNumber: string
  seekerId: string
  skillLevel: string
  stage: string
}

export type CoachJob = {
  id: string
  employmentTitle: string
  isRecommended: boolean
}

export type Coach = {
  id: string
  email: string
}
