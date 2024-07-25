import { CoachSeekerTable } from '@/coaches/types'
import { PersonSearchValue } from '@/common/types/PersonSearch'
import { camelToSnake } from '@/common/utils/functions'
import { useAuthToken } from '@/hooks/useAuthToken'
import { get } from '@/http-common'
import { useQuery } from '@tanstack/react-query'

export const usePersonSearch = ({ searchTerms, attributeFilters }: PersonSearchValue) => {
  const token = useAuthToken()

  return useQuery(['personSearch', token, searchTerms, attributeFilters], async () => {
    const params: any = {}

    Object.entries(attributeFilters).forEach(([key, values]) => {
      params[key] = values
    })

    params[camelToSnake('utm_term')] = searchTerms

    return (await get<CoachSeekerTable[]>(`/coaches/contexts`, token, params)).data
  })
}
