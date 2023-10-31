import { JobInteraction } from '@prisma/client'
import { useMutation, useQueryClient } from 'react-query'
import { FrontendJobInteractionsService } from '../services/jobInteractions.service'

export const useUpdateJobInteraction = () => {
  return useMutation((jobInteraction: Partial<JobInteraction>) => {
    return FrontendJobInteractionsService.update(jobInteraction)
  })
}
