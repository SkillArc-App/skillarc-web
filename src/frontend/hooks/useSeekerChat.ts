import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { Chat } from './useEmployerChats'

export const useSeekerChat = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

  const chatsQuery = useQuery(['chats', token], () => {
    if (!token) return Promise.reject('No user id')

    const getChats = async () => {
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/seekers/chats/`, token)

      return res.data
    }

    return getChats()
  })

  return chatsQuery
}
