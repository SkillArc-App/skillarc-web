import { FrontendEmployerService } from '../../../frontend/services/employer.service'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const useAllEmployers = () =>
  useAuthenticatedQuery(['employers'], ({ token }) => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.getAll(token)
  })
