import { LoadingPage } from '@/app/components/Loading'
import { Box, Flex, Heading, Stack, Tab, TabList, Tabs } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Suspense } from 'react'
import MyJobsClient from './page-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillArc: Your Jobs',
  description: 'Look at your saved and viewed jobs',
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

function MyJobs() {
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
            <MyJobsClient />
          </Suspense>
        </Stack>
      </Box>
    </Box>
  )
}

export default MyJobs
