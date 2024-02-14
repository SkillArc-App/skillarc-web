import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const usePassReasons = () => {
  const getPassReasons = useAuthenticatedQuery(['pass_reasons'], async ({ token }) => {
    const res = await get<{ id: string; description: string }[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/pass_reasons`,
      token,
      { camel: false }
    )

    return res.data
  })

  return { getPassReasons }
}
