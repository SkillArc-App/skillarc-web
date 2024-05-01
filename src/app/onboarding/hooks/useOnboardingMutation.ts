import { AllResponses } from '@/common/types/OnboardingResponse'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { put } from '@/frontend/http-common'
import { useMutation, useQueryClient } from 'react-query'
import { OnboardingResponse } from './useOnboardingQuery'
import { useRouter } from 'next/navigation'

export const useOnboardingMutation = () => {
  const queryClient = useQueryClient()
  const token = useAuthToken()
  const router = useRouter()

  return useMutation(
    async (responses: Partial<AllResponses>) => {
      const result = await put<OnboardingResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`,
        {
          responses: responses,
        },
        token as string,
      )

      return result.data
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('onboarding_data')
        queryClient.invalidateQueries('me')
        router.push(`/onboarding/${data.nextStep}`)
      },
    },
  )
}
