'use client'

import { useAuthToken } from '@/hooks/useAuthToken'
import { post } from '@/http-common'
import { useEffect, useState } from 'react'

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [sessionStarted, setSessionStarted] = useState(false)
  const token = useAuthToken()

  useEffect(() => {
    if (!!token && !sessionStarted) {
      setSessionStarted(true)

      post('/session', {}, token)
    }
  }, [sessionStarted, token])

  return <>{children}</>
}
