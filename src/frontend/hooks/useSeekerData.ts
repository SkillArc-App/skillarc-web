import { FrontendProfileService } from '../services/profile.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useSeekerData = () => {
  const getSeekers = useAuthenticatedQuery(['seekers'], ({ token }) => {
    return FrontendProfileService.getAll(token)
  })

  return { getSeekers }
}
