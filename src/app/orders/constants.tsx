import { JobOrderStatusMapping } from "./types"

export const colorMap: JobOrderStatusMapping = {
  needs_order_count: 'red',
  open: 'blue',
  waiting_on_employer: 'yellow.500',
  filled: 'green',
  not_filled: 'red',
}

export const displayMap: JobOrderStatusMapping = {
  needs_order_count: 'Needs Order Count',
  open: 'Open',
  waiting_on_employer: 'Waiting on Employer',
  filled: 'Closed',
  not_filled: 'Closed Without Filling',
}