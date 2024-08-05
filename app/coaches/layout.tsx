'use client'

import { Box, Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Coaches = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()

  const tabs: Record<string, number> = {
    '/coaches/seekers': 0,
    '/coaches/tasks': 1,
    '/coaches/feed': 2,
    '/coaches/jobs': 3,
  }

  const index = tabs[pathName] || 0

  return (
    <Box bg={'gray.50'} px={'4rem'} pt={'1rem'} height={'100%'} width={'100%'}>
      <Tabs height={'100%'} variant={'enclosed'} index={index}>
        <TabList>
          <Tab as={Link} href={'/coaches/seekers'}>
            Seekers
          </Tab>
          <Tab as={Link} href={'/coaches/tasks'}>
            Tasks
          </Tab>
          <Tab as={Link} href={'/coaches/feed'}>
            Feed
          </Tab>
          <Tab as={Link} href={'/coaches/jobs'}>
            Jobs
          </Tab>
        </TabList>
        <TabPanels pt={'1rem'} height={'calc(100% - 42px)'} display={'flex'} flexDir={'column'}>
          {children}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default withAuthenticationRequired(Coaches)
