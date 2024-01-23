import { Maybe } from '@/common/types/maybe'
import { useParams } from 'next/navigation'

export const useFixedParams = (...keys: string[]): Maybe<Record<string, string>> => {
  const params = useParams()

  return !!params ? toStringRecord(params, keys) : undefined
}

function toStringRecord(
  record: Record<string, string | string[]>,
  keys: string[],
): Record<string, string> {
  return keys.reduce((newRecord, key) => {
    const value = record[key]
    if (typeof value !== 'string') {
      throw new Error('URL Param was not a string. Only useFixedParams for non fixed routes.')
    }

    newRecord[key] = value
    return newRecord
  }, {} as Record<string, string>)
}
