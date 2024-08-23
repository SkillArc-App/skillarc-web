import { Note } from '@/common/types/Note'

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

export enum ContextKind {
  LEAD = 'lead',
  SEEKER = 'seeker',
}

export enum ContactType {
  EMAIL = 'email',
  PHONE = 'phone',
  SMS = 'sms',
}

export enum ContactDirection {
  SENT = 'sent',
  RECEIVED = 'received',
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

export type PersonAttribute = {
  id: string
  name: string
  attributeId: string
  value: string[]
}

export type PersonContact = {
  contactType: ContactType
  note: string
  contactDirection: ContactDirection
  contactedAt: string
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
  | 'kind'
  | 'leadCapturedAt'
  | 'leadCapturedBy'
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
  leadCapturedAt?: string
  leadCapturedBy?: string
  attributes: PersonAttribute[]
  contacts: PersonContact[]
  certifiedBy?: string
  email: string
  jobRecommendations: string[]
  firstName: string
  lastActiveOn?: string
  lastContacted?: string
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
