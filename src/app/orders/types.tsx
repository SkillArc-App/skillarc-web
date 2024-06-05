import { ApplicationStatus } from '@/common/types/ApplicantStatus'
import { Note } from '@/common/types/Note'

export type JobOrderStatuses =
  | 'needs_order_count'
  | 'open'
  | 'waiting_on_employer'
  | 'filled'
  | 'not_filled'

export enum CandidateStatuses {
  ADDED = 'added',
  RECOMMENDED = 'recommended',
  HIRED = 'hired',
  RESCINDED = 'rescinded',
}

export type JobOrderStatusMapping<T = string> = {
  [key in JobOrderStatuses]: T
}

export type CandidateStatusesMapping<T = string> = {
  [key in CandidateStatuses]: T
}

export type JobOrderSummary = {
  id: string
  employmentTitle: string
  employerName: string
  openedAt: string
  recommendedCount: number
  hireCount: number
  orderCount: number
  status: JobOrderStatuses
}

export type Job = {
  id: string
  employmentTitle: string
  employerName: string
  employerId: string
}

export type JobOrder = JobOrderSummary & {
  candidates: Candidate[]
  notes: Note[]
}

type Person = {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  personId: string
}

export type Candidate = Person & {
  id: string
  appliedAt?: string
  recommendedAt?: string
  status: CandidateStatuses
}
