import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export type Barrier = {
  id: string
  name: string
}

export const useBarrierData = () =>
  useAuthenticatedQuery(['barriers'], ({ token }) => {
    const getBarriersRequest = async () => {
      const res = await get<Barrier[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/barriers/`,
        token
      )

      return res.data
    }

    return getBarriersRequest()
  })
