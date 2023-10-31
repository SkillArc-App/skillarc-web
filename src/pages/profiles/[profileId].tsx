import { LoadingPage } from '@/frontend/components/Loading'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { ProfileAbout } from '@/frontend/modules/profile/components/about.component'
import { ProfileCertifications } from '@/frontend/modules/profile/components/certifications.component'
import { ProfileEducation } from '@/frontend/modules/profile/components/education.component'
import { ProfileExperience } from '@/frontend/modules/profile/components/experience.component'
import { PersonalExperience } from '@/frontend/modules/profile/components/personalExperience'
import { ProfileReferences } from '@/frontend/modules/profile/components/reference.component'
import { ProfileSkills } from '@/frontend/modules/profile/components/skills.component'
import { ProfileSummary } from '@/frontend/modules/profile/components/summary.component'
import { Box, Flex, Grid, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function ProfileId() {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string)

  if (!profileId) return <LoadingPage />
  if (!data) return <LoadingPage />

  return (
    <Box w={'100%'} bg="greyscale.300" padding={'2rem'}>
      <ProfileSummary />
      <Flex gap={'1rem'} paddingBottom={'1.5rem'} paddingTop={'1.5rem'}>
        <Stack flex={3} flexWrap="wrap" gap="1rem">
          <ProfileExperience />
          <ProfileCertifications />
          <ProfileEducation />
          <PersonalExperience />
        </Stack>
        <Stack flex={2} flexWrap="wrap" gap="1rem">
          <ProfileAbout />
          <ProfileReferences />
          <ProfileSkills />
          {/* <ProfileReferences /> */}
        </Stack>
      </Flex>
    </Box>
  )
}

function Foo() {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string)

  if (!profileId) return <LoadingPage />
  if (!data) return <LoadingPage />

  return (
    <Box w={'100%'} bg="greyscale.300" padding={'2rem'}>
      <ProfileSummary />
      <Grid my={'1rem'} templateColumns={{ base: '1fr', md: '3fr 2fr' }} gap="4" w="full">
        <ProfileExperience />
        <ProfileEducation />
        {/* Training */}
        <ProfileCertifications />
        <ProfileSkills />
        <ProfileAbout />
        <PersonalExperience />
      </Grid>
    </Box>
  )
}

export default Foo
