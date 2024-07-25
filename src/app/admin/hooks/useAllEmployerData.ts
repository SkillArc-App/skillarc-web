import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { FrontendEmployerService } from '../../services/employer.service'

export const useAllEmployers = () =>
  useAuthenticatedQuery(['employers'], ({ token }) => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.getAll(token)
  })
