import { Chat } from '@/common/types/Chat'
import { Maybe } from '@/common/types/maybe'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { UseQueryOptions } from 'react-query'

export const useEmployerChats = (
  options: Omit<
    UseQueryOptions<Chat[], unknown, Chat[], readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) =>
  useAuthenticatedQuery(
    ['chats'],
    ({ token }) => {
      const getChats = async () => {
        const res = await get<Chat[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers/chats/`, token)

        return res.data
      }

      return getChats()
    },
    options,
  )
