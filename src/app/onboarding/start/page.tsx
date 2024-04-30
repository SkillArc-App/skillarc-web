'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useOnboardingQuery } from '../hooks/useOnboardingQuery'

const Start = () => {
  const { data, refetch } = useOnboardingQuery()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      if (data.nextStep != 'start') {
        router.push(`/onboarding/${data.nextStep}`)
      } else {
        setTimeout(refetch, 500)
      }
    }
  }, [data, refetch, router])

  return <LoadingPage />
}

export default withAuthenticationRequired(Start)
