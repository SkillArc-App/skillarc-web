import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const useOnboardingBypassMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useAuthenticatedMutation(
    async (_: void, token: string) => {
      const result = await post<void>(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions/bypass`,
        {},
        token,
      )

      return result.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['onboarding_data'])
        queryClient.invalidateQueries(['me'])
        router.push('/onboarding/complete_loading')
      },
    },
  )
}
