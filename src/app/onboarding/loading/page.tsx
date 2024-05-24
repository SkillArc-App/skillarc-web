'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useOnboardingQuery } from '../hooks/useOnboardingQuery'

const Loading = () => {
  const { data, refetch } = useOnboardingQuery()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      router.push(`/onboarding/${data.nextStep}`)
    }
  }, [data, refetch, router])

  return <LoadingPage />
}

export default withAuthenticationRequired(Loading)
