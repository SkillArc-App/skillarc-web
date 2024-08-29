'use client'

import { LoadingPage } from '@/components/Loading'
import { useUser } from '@/hooks/useUser'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { data: user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading) {
      if (user?.profile.id) {
        redirect(`/profiles/${user?.profile.id}`)
      } else {
        redirect('/onboarding')
      }
    }
  }, [isLoading, user?.profile.id])

  return <LoadingPage />
}
