import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { FrontendEmployerService } from '../../services/employer.service'

export const useEmployerData = (id: string) =>
  useAuthenticatedQuery(['employer', id], ({ token }) => {
    return FrontendEmployerService.get(id, token)
  })
