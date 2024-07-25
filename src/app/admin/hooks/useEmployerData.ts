import { FrontendEmployerService } from '../../../frontend/services/employer.service'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const useEmployerData = (id: string) =>
  useAuthenticatedQuery(['employer', id], ({ token }) => {
    return FrontendEmployerService.get(id, token)
  })
