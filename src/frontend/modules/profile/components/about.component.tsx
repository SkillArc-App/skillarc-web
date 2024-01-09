import { useProfileData } from '@/frontend/hooks/useProfileData'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaUser } from 'react-icons/fa6'
import { Text } from '../../../components/Text.component'
import { ProfileBox } from './profileBox.component'

export const ProfileAbout = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
    isMyProfile,
  } = useProfileData(profileId as string)

  return (
    <ProfileBox
      title="About"
      icon={FaUser}
      onAddClick={() => {
        router.push({
          pathname: `${profileId}/editProfile`,
          query: { section: 'about' },
        })
      }}
    >
      <Accordion defaultIndex={[0]} allowMultiple color={'greyscale.700'}>
        {data?.stories.map((story: any, index: number) => {
          return (
            <Flex flexDir="column" key={index}>
              <AccordionItem>
                <AccordionButton alignItems="top">
                  <Heading variant="h4" textAlign="left" flex={1} color={'greyscale.900'}>
                    {story.prompt}
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text variant="b2">{story.response}</Text>
                </AccordionPanel>
              </AccordionItem>
              <Divider borderColor="greyscale.300" />
            </Flex>
          )
        })}
      </Accordion>
    </ProfileBox>
  )
}
