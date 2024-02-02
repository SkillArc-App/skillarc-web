import { SearchJob, SearchValue } from '@/common/types/Search'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { get } from '@/frontend/http-common'
import { useQuery } from 'react-query'

function camelToSnake(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export const useJobSearch = ({ searchTerms, filters }: SearchValue) => {
  const token = useAuthToken()

  const stringifiedFilters = JSON.stringify(filters)

  return useQuery(['jobSearch', token, searchTerms, stringifiedFilters], async () => {
    let params: any = {}

    // apparently axios tries to "help" ignores our recasing header for get requests
    params[camelToSnake('searchTerms')] = searchTerms

    Object.entries(filters).forEach(([key, values]) => {
      params[camelToSnake(key)] = values.map((v) => v.value)
    })

    return (await get<SearchJob[]>(`seekers/jobs`, token, { camel: true }, params)).data
  })
}
