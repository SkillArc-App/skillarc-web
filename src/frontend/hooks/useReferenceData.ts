import { Maybe } from '@/common/types/maybe'
import { FrontendReferenceService } from '../services/reference.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useReferenceData = (referenceId: Maybe<string>) => {
  const getReference = useAuthenticatedQuery(
    ['profile', referenceId],
    ({ token }) => {
      if (!referenceId) return Promise.reject('Reference Id not set')

      return FrontendReferenceService.getOne(referenceId, token)
    },
    { enabled: !!referenceId },
  )

  return { getReference }
}
