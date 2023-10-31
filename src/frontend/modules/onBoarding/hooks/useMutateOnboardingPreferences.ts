import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileService } from '@/frontend/services/profile.service'
import { useMutation } from 'react-query'

type PreferencesMutation = {
  id?: string
  informationConsent?: string
  emailConsent?: string
}
export const useMutateOnboardingPreferences = () => {
  const { data: user } = useUser()
  return useMutation((preferences: PreferencesMutation) => {
    return FrontendProfileService.updatePreferences(preferences, user?.profile?.id)
  })
}
