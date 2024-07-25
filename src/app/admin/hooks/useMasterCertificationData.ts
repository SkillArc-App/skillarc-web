import { FrontendMasterCertificationService } from '../../../frontend/services/certification.service'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const useMasterCertificationData = () => {
  const masterCertificationQuery = useAuthenticatedQuery(['masterCertification'], ({ token }) => {
    return FrontendMasterCertificationService.getAll(token)
  })

  return { masterCertificationQuery }
}
