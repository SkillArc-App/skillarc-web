'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SeekerInvite() {
  const router = useRouter()
  const seekerInviteId = useFixedParams('id')?.['id']

  useEffect(() => {
    if (seekerInviteId) {
      localStorage.setItem('seekerInviteCode', seekerInviteId)
      router.push('/')
    }
  }, [router, seekerInviteId])

  return <LoadingPage />
}
