import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function SeekerInvite() {
  const router = useRouter()
  const { seekerInviteId } = router.query

  useEffect(() => {
    localStorage.setItem('seekerInviteCode', seekerInviteId as string)
    router.push('/')
  })

  return <></>
}
