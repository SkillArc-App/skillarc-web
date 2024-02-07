import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useReferenceData } from '@/frontend/hooks/useReferenceData'
import { Reference } from '@/frontend/modules/reference/components/reference.component'
import { useUpdateReference } from '@/frontend/modules/reference/hooks/useUpdateReference'
import { useRouter } from 'next/router'

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
        seeker_profile_id: data.seeker_profile_id,
        reference_text: reference,
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
        seekerProfileId={data.seeker_profile_id}
        startingReferenceText={data.reference_text}
      />
    )
  } else {
    return <LoadingPage />
  }
}
