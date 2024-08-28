import { CandidateStatusesMapping, JobOrderStatusMapping } from './types'

export const orderColorMap: JobOrderStatusMapping = {
  needs_order_count: 'red',
  needs_criteria: 'red',
  needs_screener_or_bypass: 'red',
  open: 'blue',
  candidates_screened: 'purple',
  waiting_on_employer: 'yellow',
  filled: 'green',
  not_filled: 'red',
}

export const orderDisplayMap: JobOrderStatusMapping = {
  needs_order_count: 'Needs Order Count',
  needs_criteria: 'Needs Job Criteria Set',
  needs_screener_or_bypass: 'Needs an Assigned Screener or be Bypassed',
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
