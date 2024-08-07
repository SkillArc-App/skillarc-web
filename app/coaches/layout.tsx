import { LoadingPage } from '@/components/Loading'
import { Metadata } from 'next'
import { Suspense } from 'react'
import LayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'SkillArc: Coaches Dashboard',
  description: 'The SkillArc Coaching Dashboard',
}

const Coaches = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LayoutClient>{children}</LayoutClient>
    </Suspense>
  )
}

export default Coaches
