import { Chat } from '@/common/types/Chat'
import { Maybe } from '@/common/types/maybe'
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { UseQueryOptions } from '@tanstack/react-query'

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
        const res = await get<Chat[]>(`/employers/chats/`, token)

        return res.data
      }

      return getChats()
    },
    options,
  )
