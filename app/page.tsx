import { LoadingPage } from 'app/components/Loading'
import { Metadata } from 'next'
import { Suspense } from 'react'
import HomeClient from './page-client'

export const metadata: Metadata = {
  title: 'SkillArc: Welcome',
  keywords: [
    'job search',
    'SkillArc',
    'jobs',
    'Columbus',
    'job search engine',
    'job listings',
    'search jobs',
    'career',
    'employment',
    'staffing',
    'hiring',
  ],
  description: 'SkillArc your career and hiring partner in Columbus Ohio.',
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <HomeClient />
    </Suspense>
  )
}
