import { CoachSeekerTable } from '@/app/coaches/types'
import { PersonSearchValue } from '@/app/common/types/PersonSearch'
import { camelToSnake } from '@/app/common/utils/functions'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { get } from '@/app/http-common'
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
