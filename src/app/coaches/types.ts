import { Note } from '@/common/types/Note'
import { Barrier } from '@/frontend/hooks/useBarrierData'

export type SeekerLead = {
  id: string
  kind: ContextKind
  leadId: string
  assignedCoach: string
  email?: string
  phoneNumber: string
  firstName: string
  lastName: string
  leadCapturedAt: string
  leadCapturedBy: string
  status: string
}

type ContextKind = 'lead' | 'seeker'

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

export type FeedEvent = {
  id: string
  seekerEmail: string
  description: string
  contextId: string
  occurredAt: string
}

export type CoachTask = {
  id: string
  note: string
  state: 'set' | 'complete'
  reminderAt: string
  contextId: string | null
}

export type SubmittableCoachTask = Pick<CoachTask, 'reminderAt' | 'note' | 'contextId'>

export type CoachSeekerTable = Pick<
  CoachSeeker,
  | 'id'
  | 'assignedCoach'
  | 'barriers'
  | 'certifiedBy'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'lastActiveOn'
  | 'lastContacted'
  | 'seekerId'
>

export type CoachSeeker = {
  id: string
  kind: ContextKind
  applications: SeekerApplication[]
  assignedCoach: string
  attributes: {
    id: string
    name: string
    attributeId: string
    value: string[]
  }[]
  barriers: Barrier[]
  certifiedBy?: string
  email: string
  jobRecommendations: string[]
  firstName: string
  lastActiveOn: string
  lastContacted: string
  lastName: string
  notes: Note[]
  phoneNumber: string
  seekerId: string
  skillLevel: string
}

export type CoachJob = {
  id: string
  employerName: string
  employmentTitle: string
  isRecommended: boolean
}

export type Coach = {
  id: string
  email: string
}
