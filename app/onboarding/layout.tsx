import { Flex, Progress } from '@chakra-ui/react'
import { Suspense } from 'react'
import LayoutClient from './layout-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillArc: Onboarding',
  keywords: ["jobs", "SkillArc", "resume", "profile", "onboarding"],
  description: 'Create your profile at SkillArc and start your next career',
}

const Onboarding = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex bg={'greyscale.100'} w="100%">
      <Flex flexDir={'column'} px={'1rem'} py={'1.5rem'} gap={'0.5rem'} width={'100%'}>
        <Suspense
          fallback={
            <Progress mb={'2rem'} borderRadius={'2px'} colorScheme="green" size="sm" value={0} />
          }
        >
          <LayoutClient>{children}</LayoutClient>
        </Suspense>
      </Flex>
    </Flex>
  )
}

export default Onboarding
