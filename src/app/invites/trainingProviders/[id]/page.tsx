"use client"

import { LoadingPage } from '@/frontend/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TrainingProviderInvite() {
  const router = useRouter()
  const trainingProviderInviteId = useFixedParams('id')?.['id']

  useEffect(() => {
    if (trainingProviderInviteId) {
      localStorage.setItem('seekerInviteCode', trainingProviderInviteId)
      router.push('/')
    }
  }, [router, trainingProviderInviteId])

  return <LoadingPage />
}
