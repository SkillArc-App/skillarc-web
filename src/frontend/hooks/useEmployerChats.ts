import { Chat } from '@/common/types/Chat'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useEmployerChats = () =>
  useAuthenticatedQuery(['chats'], ({ token }) => {
    const getChats = async () => {
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers/chats/`, token,)

      return res.data
    }

    return getChats()
  })
