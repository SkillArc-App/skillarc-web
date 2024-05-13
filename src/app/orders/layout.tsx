'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useUser } from '@/frontend/hooks/useUser'
import { GridItem, SimpleGrid } from '@chakra-ui/react'
import { redirect } from 'next/navigation'

const JobOrderLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser()

  if (isLoading) return <LoadingPage />
  if (!user) return <LoadingPage />
  if (!user.userRoles?.some((ur) => ur.role.name === 'job_order_admin')) {
    redirect('/')
  }

  return (
    <SimpleGrid pt={'1rem'} columns={12} height={'100%'} overflow={'clip'} width={'100%'}>
      <GridItem colSpan={1} />
      <GridItem overflow={'scroll'} colSpan={10}>
        {children}
      </GridItem>
      <GridItem colSpan={1} />
    </SimpleGrid>
  )
}

export default JobOrderLayout
