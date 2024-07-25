import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { FrontendMasterCertificationService } from '../../services/certification.service'

export const useMasterCertificationData = () => {
  const masterCertificationQuery = useAuthenticatedQuery(['masterCertification'], ({ token }) => {
    return FrontendMasterCertificationService.getAll(token)
  })

  return { masterCertificationQuery }
}
