import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { FrontendEmployerInviteService } from '../../services/employerInvite.service'

export const useAllEmployerInviteData = () => {
  const getEmployerInvites = useAuthenticatedQuery(['employerInvites'], ({ token }) => {
    return FrontendEmployerInviteService.getAll(token)
  })

  return { getEmployerInvites }
}
