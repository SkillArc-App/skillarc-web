import { Attribute } from '@/common/types/Attribute'
import { useQuery } from '@tanstack/react-query'

type AttributeResponse = {
  id: string
  default: Dictionary<string>
  description: string
  machine_derived: boolean
  name: string
  set: Dictionary<string>
}

export const useAttributes = () =>
  useQuery(['attributes'], () => {
    const getAll = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attributes`)
      const data = await (res.json() as Promise<AttributeResponse[]>)

      const attributes: Attribute[] = data.map(({ machine_derived, ...rest}) => ({ ...rest, machineDerived: machine_derived}))
      return attributes
    }

    return getAll()
  })
