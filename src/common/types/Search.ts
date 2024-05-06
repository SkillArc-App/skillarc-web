export type SearchJob = {
  id: string
  employmentTitle: string
  industries: string[]
  location: string
  applicationStatus?: string
  elevatorPitch?: string
  tags: string[]
  startingPay?: StartingPay
  saved: boolean
  employer: SearchEmployer
}

export type SearchEmployer = {
  id: string
  name: string
  logoUrl: string
}

export type SearchValue = {
  searchTerms: string
  filters: {
    [key: string]: SearchOption<any>[]
  }
  otherUtmParams: Partial<UtmParams>
}

export type UtmParams = {
  utmSource: string
  utmTerm: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
}

export type SearchFilter<T = any> = {
  label: string
  key: string
  options: readonly SearchOption<T>[]
}

export type SearchOption<T> = {
  label: string
  value: T
}

type StartingPay = {
  employmentType: 'salary' | 'hourly'
  upperLimit: number
  lowerLimit: number
}
