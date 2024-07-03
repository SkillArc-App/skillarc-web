import { CandidateStatusesMapping, JobOrderStatusMapping } from './types'

export const orderColorMap: JobOrderStatusMapping = {
  needs_order_count: 'red',
  open: 'blue',
  candidates_screened: 'purple',
  waiting_on_employer: 'yellow',
  filled: 'green',
  not_filled: 'red',
}

export const orderDisplayMap: JobOrderStatusMapping = {
  needs_order_count: 'Needs Order Count',
  open: 'Open',
  candidates_screened: 'Candidates Screened by Coaching',
  waiting_on_employer: 'Waiting on Employer',
  filled: 'Closed',
  not_filled: 'Closed Without Filling',
}

export const candidateDisplayMap: CandidateStatusesMapping = {
  added: 'Open',
  recommended: 'Sent to Employer',
  hired: 'Hired',
  screened: 'Screened by Coaching',
  rescinded: 'Rejected',
}

export const candidateColorMap: CandidateStatusesMapping = {
  added: 'blue',
  recommended: 'yellow.500',
  hired: 'green',
  screened: 'purple',
  rescinded: 'red',
}
