import { LoadingPage } from '@/app/components/Loading'
import { Suspense } from 'react'
import HomeClient from './page-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillArc: Welcome',
  keywords: ["job search", "SkillArc", "jobs", "Columbus", "job search engine", "job listings", "search jobs", "career", "employment", "staffing", "hiring"],
  description: 'SkillArc your career and hiring partner in Columbus Ohio.',
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <HomeClient />
    </Suspense>
  )
}
