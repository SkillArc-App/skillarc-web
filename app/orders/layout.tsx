import { LoadingPage } from '@/components/Loading'
import { Metadata } from 'next'
import { Suspense } from 'react'
import LayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'SkillArc: Job Orders Dashboard',
  description: 'The SkillArc Orders Dashboard',
}

const Orders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LayoutClient>{children}</LayoutClient>
    </Suspense>
  )
}

export default Orders
