import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

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

export const useEmployerChats = () =>
  useAuthenticatedQuery(['chats'], ({ token }) => {
    const getChats = async () => {
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers/chats/`, token,)

      return res.data
    }

    return getChats()
  })
