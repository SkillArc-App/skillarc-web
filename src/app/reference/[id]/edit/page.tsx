'use client'

import { useUpdateReference } from '@/app/reference/[id]/edit/hooks/useUpdateReference'
import { Reference } from '@/app/reference/components/reference'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useReferenceData } from '@/frontend/hooks/useReferenceData'
import { useRouter } from 'next/navigation'

export default function EditReferences() {
  const router = useRouter()
  const id = useFixedParams('id')?.['id']
  const {
    getReference: { data },
  } = useReferenceData(id)
  const { onUpdateReference } = useUpdateReference()

  const token = useAuthToken()

  const handleSubmit = (reference: string) => {
    if (!data) return
    if (!token) return
    if (!id) return

    onUpdateReference(
      {
        seekerProfileId: data.seekerProfileId,
        referenceText: reference,
        id,
      },
      token,
    )
    router.push('/students')
  }

  if (data) {
    return (
      <Reference
        onSubmit={handleSubmit}
        seekerProfileId={data.seekerProfileId}
        startingReferenceText={data.referenceText}
      />
    )
  } else {
    return <LoadingPage />
  }
}
