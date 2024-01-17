import { useMutation } from 'react-query'
import { FrontendJobInteractionsService } from '../services/jobInteractions.service'

export type JobInteraction = {
  id: string
  job_id: string
  user_id: string
  has_viewed: boolean | null
  percent_match: number | null
  intent_to_apply: boolean | null
  created_at: Date
  updated_at: Date
}

export const useUpdateJobInteraction = () => {
  return useMutation((jobInteraction: Partial<JobInteraction>) => {
    return FrontendJobInteractionsService.update(jobInteraction)
  })
}
