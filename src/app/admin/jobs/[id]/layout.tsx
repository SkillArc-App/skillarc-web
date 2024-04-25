'use client'

import { Tab, TabList, Tabs } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminJob } from '../../hooks/useAdminJob'

const AdminJobLayout = ({
  children,
  params: { id },
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const pathName = usePathname()

  const tabs: Record<string, number> = {
    'the-basics': 0,
    industries: 1,
    attributes: 2,
    'attached-skills': 3,
    'attached-certifications': 4,
    testimonials: 5,
    photos: 6,
    'career-path': 7,
    tags: 8,
  }

  const index = tabs[pathName.split('/').pop()!] || 0

  if (!job) return <></>

  return (
    <Tabs my={'1rem'} variant={'enclosed'} index={index}>
      <TabList>
        <Tab as={NextLink} href={`the-basics`}>
          The Basics
        </Tab>
        <Tab as={NextLink} href={`industries`}>
          Industries
        </Tab>
        <Tab as={NextLink} href={`attributes`}>
          Attributes
        </Tab>
        <Tab as={NextLink} href={`attached-skills`}>
          Attached Skills
        </Tab>
        <Tab as={NextLink} href={`attached-certifications`}>
          Attached Certifications
        </Tab>
        <Tab as={NextLink} href={`testimonials`}>
          Testimonials
        </Tab>
        <Tab as={NextLink} href={`photos`}>
          Photos
        </Tab>
        <Tab as={NextLink} href={`career-path`}>
          Career Path
        </Tab>
        <Tab as={NextLink} href={`tags`}>
          Tags
        </Tab>
      </TabList>
      {children}
    </Tabs>
  )
}

export default AdminJobLayout
