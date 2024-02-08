import { Heading } from '@/frontend/components/Heading.component'
import { GetOneProfileResponse } from '@/frontend/services/profile.service'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { Text } from '@/frontend/components/Text.component'

export const ProfileCertifications = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  const profileCertifications = seeker.profileCertifications

  if (profileCertifications.length > 0) return <></>

  return (
    <Flex
      w="100%"
      p="1rem"
      bg="greyscale.100"
      borderRadius="0.25rem"
      boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      direction="column"
    >
      <Flex w="100%" alignItems={'center'}>
        <Text type="overline" color="greyscale.700" w="100%">
          CERTIFICATIONS
        </Text>
        {seeker?.isProfileEditor && (
          <Button
            as={Link}
            variant={'icon'}
            color="greyscale.600"
            href={`${seeker.id}/edit/certification`}
          >
            <EditIcon />
          </Button>
        )}
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap="1rem">
        {profileCertifications.map((cert: any, index: number) => {
          return (
            <Flex w="100%" flexWrap="wrap" key={index}>
              <Heading type="h4" color="greyscale.700" w="100%">
                {cert.masterCertification.certification}
              </Heading>
              {index != profileCertifications.length - 1 && (
                <Divider borderColor="#DEE2E6" w="100%" marginTop="1rem" />
              )}
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}
