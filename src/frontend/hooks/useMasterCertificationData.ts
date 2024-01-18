import { FrontendMasterCertificationService } from '../services/certification.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useMasterCertificationData = () => {
  const masterCertificationQuery = useAuthenticatedQuery(['masterCertification'], ({ token }) => {
    return FrontendMasterCertificationService.getAll(token)
  })

  return { masterCertificationQuery }
}
