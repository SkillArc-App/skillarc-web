import { Reference } from '@/frontend/modules/reference/components/reference.component'
import { useAddReference } from '@/frontend/modules/reference/hooks/useAddReference'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function NewReference() {
  const router = useRouter()

  const { seekerProfileId } = router.query

  const { onAddReference } = useAddReference()

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const handleSubmit = async (reference: string) => {
    if (!token) return

    await onAddReference(seekerProfileId as string, reference, token)
    router.push('/students')
  }

  return <Reference onSubmit={handleSubmit} seekerProfileId={seekerProfileId as string} />
}
