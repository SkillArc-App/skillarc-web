import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { FrontendEmployerInviteService } from '../../../frontend/services/employerInvite.service'

export const useAllEmployerInviteData = () => {
  const getEmployerInvites = useAuthenticatedQuery(['employerInvites'], ({ token }) => {
    return FrontendEmployerInviteService.getAll(token)
  })

  return { getEmployerInvites }
}
