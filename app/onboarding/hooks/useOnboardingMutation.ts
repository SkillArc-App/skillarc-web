import { useQueryClient } from '@tanstack/react-query'
import { AllResponses } from 'app/common/types/OnboardingResponse'
import { useAuthenticatedMutation } from 'app/hooks/useAuthenticatedMutation'
import { put } from 'app/http-common'
import { useRouter } from 'next/navigation'
import { OnboardingResponse } from './useOnboardingQuery'

export const useOnboardingMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useAuthenticatedMutation(
    async (responses: Partial<AllResponses>, token: string) => {
      const result = await put<OnboardingResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`,
        {
          responses: responses,
        },
        token,
      )

      return result.data
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['onboarding_data'])
        queryClient.invalidateQueries(['me'])
        router.push(`/onboarding/${data.nextStep}`)
      },
    },
  )
}
