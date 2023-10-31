import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function seekerInvite() {
  const router = useRouter()
  const { id: employerInviteId } = router.query

  useEffect(() => {
    localStorage.setItem('employerInviteCode', employerInviteId as string)
    router.push('/')
  })

  return <></>
}
