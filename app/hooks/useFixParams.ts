import { useParams } from 'next/navigation'

export const useFixedParams = (...keys: string[]): Record<string, string> => {
  const params = useParams()

  if (params == null) {
    // https://nextjs.org/docs/app/api-reference/functions/use-params
    // next claims this will return null only on /pages
    throw new Error('useFixedParams used on a pages route')
  }

  return toStringRecord(params, keys)
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
