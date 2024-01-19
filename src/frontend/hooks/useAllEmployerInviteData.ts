import { FrontendEmployerInviteService } from '../services/employerInvite.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllEmployerInviteData = () => {
  const getEmployerInvites = useAuthenticatedQuery(['employerInvites'], ({ token }) => {
    return FrontendEmployerInviteService.getAll(token)
  })

  return { getEmployerInvites }
}
