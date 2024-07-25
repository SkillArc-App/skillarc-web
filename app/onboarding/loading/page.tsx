'use client'

import { LoadingPage } from 'app/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useOnboardingQuery } from '../hooks/useOnboardingQuery'

const Loading = () => {
  const { data } = useOnboardingQuery()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      router.push(`/onboarding/${data.nextStep}`)
    }
  }, [data, router])

  return <LoadingPage />
}

export default withAuthenticationRequired(Loading)
