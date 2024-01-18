import { FrontendEmployerService } from '../services/employer.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllEmployerData = () => {
  const getEmployers = useAuthenticatedQuery(['employers'], ({ token }) => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.getAll(token)
  })

  return { getEmployers }
}
