'use client'

import { Maybe } from 'app/common/types/maybe'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'

// This is your custom hook
export function useAuthToken() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<Maybe<string>>()

  useEffect(() => {
    let isSubscribed = true

    const getToken = async () => {
      if (!isAuthenticated) {
        if (isSubscribed) setToken(undefined)
        return
      }

      try {
        const accessToken = await getAccessTokenSilently()
        if (isSubscribed) setToken(accessToken)
      } catch (error) {
        console.error('Error getting access token', error)
        if (isSubscribed) setToken(undefined)
      }
    }

    getToken()

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isSubscribed = false
    }
  }, [isAuthenticated, getAccessTokenSilently])

  return token
}
