import { UseQueryOptions } from '@tanstack/react-query'
import { Chat } from 'app/common/types/Chat'
import { Maybe } from 'app/common/types/maybe'
import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'

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
