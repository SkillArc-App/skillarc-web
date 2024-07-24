import { GetOneProfileResponse } from '@/frontend/services/profile.service'
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
import { FaUser } from 'react-icons/fa6'
import { Text } from '../../../components/Text.component'
import { ProfileBox } from './profileBox'

export const ProfileAbout = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  if (seeker.stories.length === 0 && !seeker.isProfileEditor) return <></>

  return (
    <ProfileBox
      title="About"
      icon={FaUser}
      isProfileEditor={seeker.isProfileEditor}
      ctaHref={`${seeker.id}/edit/about`}
    >
      <Accordion defaultIndex={[0]} allowMultiple color={'greyscale.700'}>
        {seeker?.stories.map((story: any, index: number) => {
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
