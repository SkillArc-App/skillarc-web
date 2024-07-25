'use client'

import { LoadingPage } from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useOnboardingQuery } from '../hooks/useOnboardingQuery'

export default function CompleteLoading() {
  const { data, refetch } = useOnboardingQuery({ refetchInterval: 500 })
  const [readyToRoute, setReadyToRoute] = useState(false)

  const router = useRouter()
  const isRouting = useRef(false)

  // Poll onboarding until we hit complete
  useEffect(() => {
    if (readyToRoute) {
      return
    }

    if (data?.nextStep == 'complete') {
      setReadyToRoute(true)
    }
  }, [data, readyToRoute, refetch, router])

  // Once we have a complete flag navigate wherever is appropriate
  useEffect(() => {
    if (!readyToRoute) {
      return
    }
    if (isRouting.current) {
      return
    }
    isRouting.current = true

    const jobInterest = localStorage.getItem('preOnboardingJobInterest')
    if (jobInterest) {
      localStorage.removeItem('preOnboardingJobInterest')
      router.push(`/jobs/${jobInterest}`)
    } else {
      router.push('/jobs')
    }
  }, [readyToRoute, router])

  return <LoadingPage />
}
