import { CoachSeekerTable } from '@/coaches/types'
import { FilterValue, SearchValue } from '@/common/types/Search'
import { useAuthToken } from '@/hooks/useAuthToken'
import { get } from '@/http-common'
import { useQuery } from '@tanstack/react-query'

export const usePersonSearch = ({ searchTerms, filters }: SearchValue<string>) => {
  const token = useAuthToken()

  const stringifiedFilters = JSON.stringify(filters)

  return useQuery(['personSearch', token, searchTerms, stringifiedFilters], async () => {
    const attributes = Object.entries(filters).reduce((obj, [id, filter]) => {
      const values = filter.map((v) => v.value)

      if (values.length > 0) {
        obj[id] = values
      }

      return obj
    }, {} as FilterValue<string>)

    const params = {
      utmTerm: searchTerms,
      attributes: JSON.stringify(attributes),
    }

    return (await get<CoachSeekerTable[]>(`/coaches/contexts`, token, params)).data
  })
}
