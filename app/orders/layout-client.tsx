'use client'

import { LoadingPage } from '@/components/Loading'
import { useUser } from '@/hooks/useUser'
import { Box, GridItem, SimpleGrid, Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser()
  const pathName = usePathname()

  if (isLoading) return <LoadingPage />
  if (!user) return <LoadingPage />
  if (!user.userRoles?.some((ur) => ur.role.name === 'job_order_admin')) {
    redirect('/')
  }

  const tabs: Record<string, number> = {
    '/orders/orders': 0,
    '/orders/questions': 1,
  }

  const index = tabs[pathName] || 0

  return (
    <SimpleGrid pt={'1rem'} columns={12} height={'100%'} overflow={'clip'} width={'100%'}>
      <GridItem colSpan={1} />
      <GridItem px={'1rem'} pt={'1rem'} overflow={'scroll'} colSpan={10}>
        <Tabs height={'100%'} variant={'enclosed'} index={index}>
          <TabList>
            <Tab as={Link} href={'/orders/orders'}>
              Orders
            </Tab>
            <Tab as={Link} href={'/orders/questions'}>
              Screener Questions
            </Tab>
          </TabList>
          <TabPanels>
            <Box pt={'2rem'}>{children}</Box>
          </TabPanels>
        </Tabs>
      </GridItem>
      <GridItem colSpan={1} />
    </SimpleGrid>
  )
}

export default withAuthenticationRequired(LayoutClient)
