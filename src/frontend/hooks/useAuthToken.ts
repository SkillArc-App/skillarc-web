import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'

// This is your custom hook
export function useAuthToken() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let isSubscribed = true

    const getToken = async () => {
      if (!isAuthenticated) {
        if (isSubscribed) setToken(null)
        return
      }

      try {
        const accessToken = await getAccessTokenSilently()
        if (isSubscribed) setToken(accessToken)
      } catch (error) {
        console.error('Error getting access token', error)
        if (isSubscribed) setToken(null)
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
