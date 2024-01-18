import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'
import { Chat } from './useEmployerChats'

export const useSeekerChat = () =>
  useAuthenticatedQuery(['chats'], ({ token }) => {
    if (!token) return Promise.reject('No user id')

    const getChats = async () => {
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/seekers/chats/`, token)

      return res.data
    }

    return getChats()
  })
