'use client'

import { useJobSearch } from '@/jobs/hooks/useJobSearch'
import MyJobList from '../components/MyJobsList'

export default function Page() {
  const { data: jobs, refetch } = useJobSearch({
    searchTerms: '',
    filters: {},
    otherUtmParams: {},
  })

  const jobMatches = jobs ?? []

  return <MyJobList jobs={jobMatches} refetch={refetch} />
}
