import { Chat } from '@/app/common/types/Chat'
import { Maybe } from '@/app/common/types/maybe'
import { useAuthenticatedQuery } from '@/app/hooks/useAuthenticatedQuery'
import { get } from '@/app/http-common'
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
