import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export const usePassReasons = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getPassReasons = useQuery(['pass_reasons', token], async () => {
    if (!token) return Promise.reject('No token')

    const res = await get<{ id: string; description: string }[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/pass_reasons`,
      token,
    )

    return res.data
  })

  return { getPassReasons }
}
