import { LoadingPage } from '@/components/Loading'
import { Box, Flex, Heading, Stack, Tab, TabList, Tabs } from '@chakra-ui/react'
import { Metadata } from 'next'
import NextLink from 'next/link'
import { Suspense } from 'react'
import LayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'SkillArc: Your Jobs',
  description: 'Look at your saved and viewed jobs in Columbus Ohio',
}

function FallbackPage() {
  return (
    <Tabs align={'center'} index={0} variant="soft-rounded" colorScheme="green">
      <TabList>
        <Tab as={NextLink} href="/my-jobs/recently-viewed">
          Viewed
        </Tab>
        <Tab as={NextLink} href="/my-jobs/saved">
          Saved
        </Tab>
        <Tab as={NextLink} href="/my-jobs/applied">
          Applied
        </Tab>
      </TabList>
      <LoadingPage />
    </Tabs>
  )
}

function MyJobs({ children }: { children: React.ReactNode }) {
  return (
    <Box height={'100%'} width={'100%'} overflow={'scroll'}>
      <Box m={'1rem'}>
        <Stack>
          <Flex alignItems={'center'} justifyContent={'center'}>
            <Heading mt={'0.25rem'} color={'greyscale.900'} variant={'h2'}>
              My Jobs
            </Heading>
          </Flex>
          <Suspense fallback={<FallbackPage />}>
            <LayoutClient>{children}</LayoutClient>
          </Suspense>
        </Stack>
      </Box>
    </Box>
  )
}

export default MyJobs
