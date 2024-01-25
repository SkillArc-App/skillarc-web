'use client'

import { Box, Heading, Tab, TabList, Tabs } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Coaches = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()

  const index = (pathName ?? '').includes('leads') ? 1 : 0

  return (
    <Box width={'100%'}>
      <Box px={'4rem'} pt={'1rem'}>
        <Heading>Coaches Dashboard</Heading>
        <Tabs my={'1rem'} variant={'enclosed'} index={index}>
          <TabList>
            <Tab as={Link} href={'/coaches/seekers'}>
              Seekers
            </Tab>
            <Tab as={Link} href={'/coaches/leads'}>
              Leads
            </Tab>
          </TabList>
        </Tabs>
        {children}
      </Box>
    </Box>
  )
}

export default withAuthenticationRequired(Coaches)
