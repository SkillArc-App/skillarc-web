import { FrontendEmployerService } from '../services/employer.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useEmployerData = (id: string) => {
  const getEmployer = useAuthenticatedQuery(['employer', id], ({ token }) => {
    return FrontendEmployerService.get(id, token)
  })

  return { getEmployer }
}
