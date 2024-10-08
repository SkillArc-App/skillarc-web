'use client'

import { IdParams } from '@/common/types/PageParams'
import { LoadingPage } from '@/components/Loading'
import { ProfileAbout } from '@/profiles/[id]/components/about'
import { ProfileEducation } from '@/profiles/[id]/components/education'
import { ProfileExperience } from '@/profiles/[id]/components/experience'
import ProfileCompleteness from '@/profiles/[id]/components/profileCompleteness'
import { ProfileReferences } from '@/profiles/[id]/components/reference'
import { ProfileSkills } from '@/profiles/[id]/components/skills'
import { ProfileSummary } from '@/profiles/[id]/components/summary'
import { Box, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfileData } from './hooks/useProfileData'

function ProfileId({ params: { id } }: IdParams) {
  const { data: seeker } = useProfileData(id)

  const [isMobile, setIsMobile] = useState(false) // Assuming 768px as the breakpoint

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!seeker) return <LoadingPage />

  return (
    <Box width={'100%'} bg="greyscale.300">
      <ProfileSummary seeker={seeker} />
      <Box py={'1.5rem'} p={'1rem'}>
        <ProfileCompleteness seeker={seeker} />

        {isMobile ? (
          <Box
            display={{ base: 'grid', md: 'grid' }}
            gridTemplateColumns={{ base: '1fr' }}
            gap={'1rem'}
            w={'100%'}
          >
            <ProfileExperience seeker={seeker} />
            <ProfileEducation seeker={seeker} />
            {/* Training */}
            <ProfileSkills seeker={seeker} />
            <ProfileAbout seeker={seeker} />
          </Box>
        ) : (
          <Box
            display={{ base: 'grid', md: 'grid' }}
            gridTemplateColumns={{ base: '3fr 2fr' }}
            gap={'1rem'}
            w={'100%'}
          >
            <Stack>
              <ProfileExperience seeker={seeker} />
              <ProfileEducation seeker={seeker} />
            </Stack>
            <Stack>
              <ProfileAbout seeker={seeker} />
              <ProfileReferences seeker={seeker} />
              <ProfileSkills seeker={seeker} />
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProfileId
