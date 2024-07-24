'use client'

import { useJobSearch } from '@/app/jobs/hooks/useJobSearch'
import MyJobList from '../components/MyJobsList'

export default function Page() {
  const { data: jobs, refetch } = useJobSearch({
    searchTerms: '',
    filters: {},
    otherUtmParams: {},
  })

  const jobMatches = jobs ?? []
  const appliedJobMatches = jobMatches.filter((jobMatch) => jobMatch.applicationStatus)

  return <MyJobList jobs={appliedJobMatches} refetch={refetch} />
}
