import { Chat } from '@/common/types/Chat'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'
import { UseQueryOptions } from 'react-query'
import { Maybe } from '@/common/types/maybe'

export const useEmployerChats = (  options: Omit<
  UseQueryOptions<Chat[], unknown, Chat[], readonly Maybe<string>[]>,
  'queryKey' | 'queryFn'
> = {},) =>
  useAuthenticatedQuery(['chats'], ({ token }) => {
    const getChats = async () => {
      const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers/chats/`, token,)

      return res.data
    }

    return getChats()
  }, options)
