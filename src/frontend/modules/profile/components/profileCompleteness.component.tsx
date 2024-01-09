import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Box, Button, Progress, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const ProfileCompleteness = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data: profile },
    isMyProfile,
  } = useProfileData(profileId as string)

  if (!isMyProfile) return <></>

  const profileCompleteness = ((2 - (profile?.missingProfileItems?.length ?? 0)) / 2.0) * 100

  if (profileCompleteness === 100) return <></>

  const nextSection = (() => {
    const missingItems = profile?.missingProfileItems

    if (missingItems?.includes('work')) return 'work'
    if (missingItems?.includes('education')) return 'education'

    return ''
  })()

  const onAddClick = () => {
    if (nextSection === 'work') {
      router.push({
        pathname: `${profileId}/editProfile`,
        query: { section: 'experience' },
      })
    }

    if (nextSection === 'education') {
      router.push({
        pathname: `${profileId}/editProfile`,
        query: { section: 'education' },
      })
    }
  }

  return (
    <Box bg="greyscale.100" w={'100%'} mb={'1rem'}>
      <Box p={'1rem'}>
        <Stack gap={'1rem'}>
          <Text type="overline">MAKE YOUR RESUME STRONGER!</Text>
          <Progress
            borderRadius={2}
            value={profileCompleteness + 10}
            colorScheme="green"
            size="sm"
          />
          <Heading type="h5" color="greyscale.700" w="100%">
            Let&apos;s add your {nextSection}
          </Heading>
          <Text type="b2">Completing your resume makes you 3x more likely to get hired!</Text>
          <Button onClick={onAddClick} variant={'outline'}>
            + Add {nextSection}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default ProfileCompleteness
