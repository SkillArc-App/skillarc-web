import { Chat } from '@/common/types/Chat'
import { useAuthenticatedQuery, useAuthenticatedQueryOptions } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export const useSeekerChat = (options: useAuthenticatedQueryOptions<Chat[]> = {}) =>
  useAuthenticatedQuery(
    ['chats'],
    ({ token }) => {
      if (!token) return Promise.reject('No user id')

      const getChats = async () => {
        const res = await get<Chat[]>(`/seekers/chats/`, token)

        return res.data
      }

      return getChats()
    },
    options,
  )
