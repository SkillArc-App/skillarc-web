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
  seekerId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  barriers: Barrier[]
  assignedCoach: string
  lastContacted: string
  lastActiveOn: string
  skillLevel: string
  stage: string
  notes: SeekerNote[]
  applications: SeekerApplication[]
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
