import { LoadingPage } from '@/frontend/components/Loading'
import { useReferenceData } from '@/frontend/hooks/useReferenceData'
import { Reference } from '@/frontend/modules/reference/components/reference.component'
import { useUpdateReference } from '@/frontend/modules/reference/hooks/useUpdateReference'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EditReferences() {
  const router = useRouter()
  const { referenceId } = router.query
  const {
    getReference: { data },
  } = useReferenceData(referenceId as string)
  const { onUpdateReference } = useUpdateReference()

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const handleSubmit = (reference: string) => {
    if (!data) return
    if (!token) return

    onUpdateReference(
      {
        seeker_profile_id: data.seeker_profile_id,
        reference_text: reference,
        id: referenceId as string,
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
