import { OtherExperience } from '@/common/types/OtherExperience'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendOtherExperiencesService } from '@/frontend/services/otherExperiences.service'
import { useMutation } from 'react-query'

export const useMutateOnboardingOtherExperiences = () => {
  const { data: user } = useUser()

  return useMutation((otherExperiences: Partial<OtherExperience>) => {
    if (!user?.profile?.id) throw new Error('User is not logged in')
    return FrontendOtherExperiencesService.create(otherExperiences, user?.profile?.id)
  })
}
