import { FrontendEmployerInviteService } from '../../../frontend/services/employerInvite.service'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const useAllEmployerInviteData = () => {
  const getEmployerInvites = useAuthenticatedQuery(['employerInvites'], ({ token }) => {
    return FrontendEmployerInviteService.getAll(token)
  })

  return { getEmployerInvites }
}
