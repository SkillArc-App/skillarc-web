import { Job } from './Job'

export type Employer = {
  id: string
  name: string
  logo: string
  location: string
  bio: string
  jobs: Job[]
}
