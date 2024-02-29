import { Maybe } from '@/common/types/maybe'
import { UseQueryOptions } from 'react-query'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'
import { Chat } from '@/common/types/Chat'

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
        const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/seekers/chats/`, token, {
          camel: false,
        })

        return res.data
      }

      return getChats()
    },
    options,
  )
