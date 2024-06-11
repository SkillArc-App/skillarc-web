import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { FrontendEmployerService } from '../../../frontend/services/employer.service'

export const useEmployerData = (id: string) => {
  const getEmployer = useAuthenticatedQuery(['employer', id], ({ token }) => {
    return FrontendEmployerService.get(id, token)
  })

  return { getEmployer }
}
