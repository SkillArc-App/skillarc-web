import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function seekerInvite() {
  const router = useRouter()
  const { seekerInviteId } = router.query

  useEffect(() => {
    localStorage.setItem('seekerInviteCode', seekerInviteId as string)
    router.push('/')
  })

  return <></>
}
