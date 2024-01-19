import { FrontendReferenceService } from '../services/reference.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useReferenceData = (referenceId: string) => {
  const getReference = useAuthenticatedQuery(['profile', referenceId], ({ token }) => {
    if (!token) return Promise.reject('No token')

    return FrontendReferenceService.getOne(referenceId, token)
  })

  return { getReference }
}
