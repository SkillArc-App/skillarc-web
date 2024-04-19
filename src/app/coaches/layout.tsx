'use client'

import { Box, Heading, Tab, TabList, Tabs } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Coaches = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()

  const tabs: Record<string, number> = {
    '/coaches/seekers': 0,
    '/coaches/tasks': 1,
    '/coaches/feed': 2,
    '/coaches/leads': 3,
    '/coaches/jobs': 4,
  }

  const index = tabs[pathName] || 0

  return (
    <Box width={'100%'} bg={'gray.50'}>
      <Box px={'4rem'} pt={'1rem'}>
        <Heading>Coaches Dashboard</Heading>
        <Tabs my={'1rem'} variant={'enclosed'} index={index}>
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
            <Tab as={Link} href={'/coaches/leads'}>
              Leads
            </Tab>
            <Tab as={Link} href={'/coaches/jobs'}>
              Jobs
            </Tab>
          </TabList>
        </Tabs>
        {children}
      </Box>
    </Box>
  )
}

export default withAuthenticationRequired(Coaches)
