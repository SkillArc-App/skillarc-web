import { CoachSeekerTable } from '@/coaches/types'
import { PersonSearchValue } from '@/common/types/PersonSearch'
import { SearchValue } from '@/common/types/Search'
import { camelToSnake } from '@/common/utils/functions'
import { useAuthToken } from '@/hooks/useAuthToken'
import { get } from '@/http-common'
import { useQuery } from '@tanstack/react-query'

export const usePersonSearch = ({ searchTerms, filters }: SearchValue) => {
  const token = useAuthToken()

  const stringifiedFilters = JSON.stringify(filters)

  return useQuery(['personSearch', token, searchTerms, stringifiedFilters], async () => {
    const params: any = {}

    Object.entries(filters).forEach(([key, values]) => {
      params[camelToSnake(key)] = values.map((v) => v.value)
    })

    params[camelToSnake('utm_term')] = searchTerms

    return (await get<CoachSeekerTable[]>(`/coaches/contexts`, token, params)).data
  })
}
