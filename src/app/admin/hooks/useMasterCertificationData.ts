import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { FrontendMasterCertificationService } from '../../../frontend/services/certification.service'

export const useMasterCertificationData = () => {
  const masterCertificationQuery = useAuthenticatedQuery(['masterCertification'], ({ token }) => {
    return FrontendMasterCertificationService.getAll(token)
  })

  return { masterCertificationQuery }
}
