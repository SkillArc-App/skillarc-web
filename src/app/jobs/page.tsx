import { Box, Divider, Heading, VStack } from '@chakra-ui/react'
import { Suspense } from 'react'
import SearchBarLoading from './components/SearchBarLoading'
import JobsClient from './page-client'
import { LoadingPage } from '../components/Loading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillArc: Job Search',
  description: 'Find your next job on SkillArc',
}

function LoadingFallBack() {
  return (
    <>
      <SearchBarLoading />
      <Divider />
      <LoadingPage />
    </>
  )
}

export default function Page() {
  return (
    <Box height={'100%'} width={'100%'}>
      <Box height={'100%'} width={'100%'}>
        <VStack align={'start'} m={'1rem'}>
          <Heading mb={'1.5rem'}>Find your perfect job 💼</Heading>
          <Suspense fallback={<LoadingFallBack />}>
            <JobsClient />
          </Suspense>
        </VStack>
      </Box>
    </Box>
  )
}
