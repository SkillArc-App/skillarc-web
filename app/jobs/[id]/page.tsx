import { Job } from '@/common/types/Job'
import { IdParams } from '@/common/types/PageParams'
import { SearchJob } from '@/common/types/Search'
import { LoadingPage } from '@/components/Loading'
import { get } from '@/http-common'
import { Metadata } from 'next'
import { Suspense } from 'react'
import PageClient from './page-client'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // revalidate at most every hour

// Generate segments for [category]
export async function generateStaticParams() {
  const searchJobs = (await get<SearchJob[]>('seekers/jobs')).data

  return searchJobs.map((job) => ({
    id: job.id,
  }))
}

export async function generateMetadata({ params }: IdParams): Promise<Metadata> {
  // read route params
  const id = params.id

  try {
    // fetch data
    const job = (await get<Job>(`/jobs/${id}`)).data

    // optionally access and extend (rather than replace) parent metadata
    return {
      title: `${job.employer.name} - ${job.employmentTitle}`,
      description: job.responsibilitiesDescription,
      keywords: [
        'Job',
        'Employment',
        'Columbus',
        ...job.desiredSkills.map((s) => s.masterSkill.skill),
      ],
      publisher: 'SkillArc',
    }
  } catch (e) {
    notFound()
  }
}

export default function JobPosting({ params }: IdParams) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PageClient params={params} />
    </Suspense>
  )
}
