'use client'

import { OnboardingNextStep } from '@/common/types/OnboardingData'
import { Maybe } from '@/common/types/maybe'
import { UseQueryOptions } from '@tanstack/react-query'
import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { get } from '../../../frontend/http-common'

export type OnboardingResponse = {
  nextStep: OnboardingNextStep
  progress: number
  seekerId: string
}

export const useOnboardingQuery = (
  options: Omit<
    UseQueryOptions<OnboardingResponse, unknown, OnboardingResponse, readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) =>
  useAuthenticatedQuery<OnboardingResponse>(
    ['onboarding_data'],
    async ({ token }) =>
      (await get(`${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`, token)).data,
    options,
  )
