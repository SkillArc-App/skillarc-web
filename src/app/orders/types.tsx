import { Note } from '@/common/types/Note'

export enum JobOrderStatuses {
  NEEDS_ORDER_COUNT = 'needs_order_count',
  OPEN = 'open',
  CANDIDATES_SCREENED = 'candidates_screened',
  WAITING_ON_EMPLOYER = 'waiting_on_employer',
  FILLED = 'filled',
  NOT_FILLED = 'not_filled',
}

export enum CandidateStatuses {
  ADDED = 'added',
  SCREENED = 'screened',
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
  recommendedBy?: string
  status: CandidateStatuses
}
