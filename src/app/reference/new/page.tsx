"use client"

import { Reference } from '@/app/reference/components/reference'
import { useAddReference } from '@/app/reference/new/hooks/useAddReference'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewReference() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seekerProfileId = searchParams?.get('seekerProfileId')

  const { onAddReference } = useAddReference()

  const token = useAuthToken()

  const handleSubmit = async (reference: string) => {
    if (!token) return
    if (!seekerProfileId) return

    await onAddReference(seekerProfileId, reference, token)
    router.push('/students')
  }

  if (seekerProfileId) {
    return <Reference onSubmit={handleSubmit} seekerProfileId={seekerProfileId} />
  } else {
    return <LoadingPage />
  }
}
