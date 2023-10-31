import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileCertificationService } from '@/frontend/services/profileCertifications.service'
import { ProfileCertification } from '@prisma/client'
import { useMutation } from 'react-query'

export const useMutateProfileCertifications = () => {
  const { data: user } = useUser()

  return useMutation((certification: Partial<ProfileCertification>) => {
    return FrontendProfileCertificationService.create(certification, user?.profile?.id)
  })
}
