export type Attribute = {
  id: string
  name: string
  description: string
  machineDerived: boolean
  set: Dictionary<string>
  default: Dictionary<string>
}
