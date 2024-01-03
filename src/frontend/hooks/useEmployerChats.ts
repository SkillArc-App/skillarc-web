import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export type Chat = {
  id: string
  name: string
  messages: Message[]
  updatedAt: string
}

export type Message = {
  id: string
  createdAt: string
  text: string
  isUser: boolean
  isRead: boolean
  sender: string
}

export const useEmployerChats = () => {
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
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers/chats/`, token)

      return res.data
    }

    return getChats()
  })

  return chatsQuery
}
