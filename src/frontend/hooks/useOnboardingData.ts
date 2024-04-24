import { OnboardingData } from '@/common/types/OnboardingData'
import { post } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useOnboardingData = () => {
  const getOnboardingData = useAuthenticatedQuery<OnboardingData>(
    ['onboarding_data'],
    async ({ token }) => {
      return (await post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`, {}, token)).data
    },
  )

  return { getOnboardingData }
}
