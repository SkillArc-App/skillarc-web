import { Chat } from '@/common/types/Chat'
import { Maybe } from '@/common/types/maybe'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { UseQueryOptions } from '@tanstack/react-query'

export const useSeekerChat = (
  options: Omit<
    UseQueryOptions<Chat[], unknown, Chat[], readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) =>
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
