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
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Box, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function ProfileId() {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string)

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

  if (!profileId) return <LoadingPage />
  if (!data) return <LoadingPage />

  return (
    <Box width={'100%'} bg="greyscale.300">
      <ProfileSummary />
      <Box py={'1.5rem'} p={'1rem'}>
        <ProfileCompleteness />

        {isMobile ? (
          <Box
            display={{ base: 'grid', md: 'grid' }}
            gridTemplateColumns={{ base: '1fr' }}
            gap={'1rem'}
            w={'100%'}
          >
            <ProfileExperience />
            <ProfileEducation />
            {/* Training */}
            <ProfileCertifications />
            <ProfileSkills />
            <ProfileAbout />
            <PersonalExperience />
          </Box>
        ) : (
          <Box
            display={{ base: 'grid', md: 'grid' }}
            gridTemplateColumns={{ base: '3fr 2fr' }}
            gap={'1rem'}
            w={'100%'}
          >
            <Stack>
              <ProfileExperience />
              <ProfileEducation />
              <PersonalExperience />
            </Stack>
            <Stack>
              <ProfileAbout />
              <ProfileReferences />
              <ProfileSkills />
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProfileId
