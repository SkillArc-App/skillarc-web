'use client'

import { OnboardingNextStep } from '@/app/common/types/OnboardingData'
import { Maybe } from '@/app/common/types/maybe'
import { UseQueryOptions } from '@tanstack/react-query'
import { get } from '../../../frontend/http-common'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

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
