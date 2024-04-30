'use client'

import { OnboardingNextStep } from '@/common/types/OnboardingData'
import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { post } from '../../../frontend/http-common'

export type OnboardingResponse = {
  nextStep: OnboardingNextStep
  progress: number
  seekerId: string
}

export const useOnboardingQuery = () =>
  useAuthenticatedQuery<OnboardingResponse>(
    ['onboarding_data'],
    async ({ token }) =>
      (await post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`, {}, token)).data,
  )
