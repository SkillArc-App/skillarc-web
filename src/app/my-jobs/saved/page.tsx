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
  const savedJobMatches = jobMatches.filter((jobMatch) => jobMatch.saved)

  return <MyJobList jobs={savedJobMatches} refetch={refetch} />
}