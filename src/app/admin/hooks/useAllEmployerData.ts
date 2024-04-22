import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { FrontendEmployerService } from '../../../frontend/services/employer.service'

export const useAllEmployers = () =>
  useAuthenticatedQuery(['employers'], ({ token }) => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.getAll(token)
  })
