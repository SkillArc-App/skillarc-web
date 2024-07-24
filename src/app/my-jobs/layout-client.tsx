'use client'

import { withAuthenticationRequired } from '@auth0/auth0-react'
import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathName = usePathname()

  const tabs: Record<string, number> = {
    '/my-jobs/recently-viewed': 0,
    '/my-jobs/saved': 1,
    '/my-jobs/applied': 2,
  }

  const index = tabs[pathName] || 0

  return (
    <Tabs height={'100%'} variant={'enclosed'} index={index}>
      <TabList>
        <Tab as={Link} href="/my-jobs/recently-viewed">
          Viewed
        </Tab>
        <Tab as={Link} href="/my-jobs/saved">
          Saved
        </Tab>
        <Tab as={Link} href="/my-jobs/applied">
          Applied
        </Tab>
      </TabList>
      <TabPanels pt={'1rem'} height={'100%'} display={'flex'} flexDir={'column'}>
        {children}
      </TabPanels>
    </Tabs>
  )
}

export default withAuthenticationRequired(LayoutClient)
