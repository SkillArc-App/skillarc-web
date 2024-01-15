import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileCertificationService } from '@/frontend/services/profileCertifications.service'
import { useMutation } from 'react-query'

export type ProfileCertification = {
  id: string
  master_certification_id: string
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export const useMutateProfileCertifications = () => {
  const { data: user } = useUser()

  return useMutation((certification: Partial<ProfileCertification>) => {
    return FrontendProfileCertificationService.create(certification, user?.profile?.id)
  })
}
