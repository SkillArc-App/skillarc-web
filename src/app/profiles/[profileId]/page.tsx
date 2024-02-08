"use client"

import { ProfileAbout } from '@/app/profiles/[profileId]/components/about'
import { ProfileCertifications } from '@/app/profiles/[profileId]/components/certifications'
import { ProfileEducation } from '@/app/profiles/[profileId]/components/education'
import { ProfileExperience } from '@/app/profiles/[profileId]/components/experience'
import { PersonalExperience } from '@/app/profiles/[profileId]/components/personalExperience'
import ProfileCompleteness from '@/app/profiles/[profileId]/components/profileCompleteness'
import { ProfileReferences } from '@/app/profiles/[profileId]/components/reference'
import { ProfileSkills } from '@/app/profiles/[profileId]/components/skills'
import { ProfileSummary } from '@/app/profiles/[profileId]/components/summary'
import { LoadingPage } from '@/frontend/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Box, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

function ProfileId() {
  const { profileId } = useFixedParams('profileId')
  const { data: seeker } = useProfileData(profileId)

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
            <ProfileCertifications seeker={seeker} />
            <ProfileSkills seeker={seeker} />
            <ProfileAbout seeker={seeker} />
            <PersonalExperience seeker={seeker} />
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
              <PersonalExperience seeker={seeker} />
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
