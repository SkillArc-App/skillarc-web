import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function trainingProviderInvite() {
  const router = useRouter()
  const { trainingProviderInviteId } = router.query

  useEffect(() => {
    localStorage.setItem('trainingProviderInviteCode', trainingProviderInviteId as string)
    router.push('/')
  })

  return <></>
}
