'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Complete() {
  const router = useRouter()
  const isRouting = useRef(false)

  useEffect(() => {
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
  }, [router])

  return <LoadingPage />
}
