import { SearchJob, SearchValue } from '@/common/types/Search'
import { camelToSnake } from '@/common/utils/functions'
import { useAuthToken } from '@/hooks/useAuthToken'
import { get } from '@/http-common'
import { useQuery } from '@tanstack/react-query'

export const useJobSearch = ({ searchTerms, filters, otherUtmParams }: SearchValue) => {
  const token = useAuthToken()

  const stringifiedFilters = JSON.stringify(filters)

  return useQuery(['jobSearch', token, searchTerms, stringifiedFilters], async () => {
    let params: any = { ...otherUtmParams }

    Object.entries(filters).forEach(([key, values]) => {
      params[camelToSnake(key)] = values.map((v) => v.value)
    })

    // apparently axios tries to "help" ignores our recasing header for get requests
    params[camelToSnake('utm_term')] = searchTerms

    return (await get<SearchJob[]>(`seekers/jobs`, token, params)).data
  })
}
