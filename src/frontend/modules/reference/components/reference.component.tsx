import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Link,
  Stack,
  StackDivider,
  Textarea,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
import { Text } from '../../../components/Text.component'

export const Reference = ({
  seekerProfileId,
  startingReferenceText,

  onSubmit,
}: {
  seekerProfileId: string
  startingReferenceText?: string
  onSubmit: (reference: string) => void
}) => {
  const {
    profileQuery: { data },
  } = useProfileData(seekerProfileId as string)

  const fullName = `${data?.user?.firstName} ${data?.user?.firstName}`

  // const reference using state
  const [reference, setReference] = useState(startingReferenceText)

  const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReference(e.target.value)
  }

  useEffect(() => {
    setReference(startingReferenceText)
  }, [startingReferenceText])

  if (!data) return <LoadingPage />

  return (
    <Flex w="100%" h="100%">
      <Flex bg="white" h="100%" py="24px" px="32px" w="100%" flexWrap="wrap" maxW="495px">
        <Text
          color="greyscale.600"
          type="b2"
          textDecoration="underline"
          marginBottom="24px"
          w="100%"
        >
          <Link as={NextLink} href={'/students'}>
            {'< Back to students'}
          </Link>
        </Text>

        <Heading color={'greyscale.900'} type="h2" marginBottom="24px" w="100%">
          Write a reference for:
        </Heading>
        <Flex gap={'1rem'} marginBottom="24px" w="100%">
          <Avatar
            w="90px"
            h="90px"
            src={data?.user?.image ?? ''}
            boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.05)"
            border="4px solid #3AC87C"
          />
          <Stack>
            <Heading color={'greyscale.900'} type="h3">
              {fullName}
            </Heading>
            {data?.user.zipCode && (
              <Text color={'greyscale.600'} type="b3">
                {data?.user.zipCode}
              </Text>
            )}
            <Flex>
              <Badge variant={'secondary'} borderRadius={'0.5rem'} color={'green'} p="4px 8px">
                <Text type="b2Bold" color="primary.600">
                  {data.hiringStatus}
                </Text>
              </Badge>
            </Flex>
          </Stack>
        </Flex>
        <Textarea
          onChange={(e) => handleResponseChange(e)}
          placeholder="Add text..."
          h={'300px'}
          resize={'none'}
          value={reference}
          boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.03)"
          marginBottom="8px"
          w="100%"
        />
        <Heading
          color="#F06225"
          fontSize="13px"
          fontWeight="400"
          lineHeight="normal"
          marginBottom="24px"
          w="100%"
        >
          {'<300 characters'}
        </Heading>
        <Button
          onClick={() => onSubmit(reference as string)}
          variant="primary"
          w="242px"
          marginBottom="24px"
        >
          <Text type="b1Bold">Submit</Text>
        </Button>
        <Text type="b3" color="greyscale.600" w="100%">
          This reference will be displayed on {fullName}’s BlockTrain profile for employers to view.
        </Text>
      </Flex>
      <Flex
        bg="white"
        borderRadius={'0.5rem'}
        boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.10);'}
        gap={'0.5rem'}
        my="32px"
        mx="40px"
      >
        <Flex p={'1rem'} w="100%" flexWrap="wrap" gap="24px">
          <Heading color={'greyscale.900'} type="h3" w="100%">
            💡 Tips
          </Heading>
          <Card
            bg="white"
            borderRadius={'0.5rem'}
            gap={'0.5rem'}
            border="1px solid var(--greyscale-grey-300, #DEE2E6)"
            w="100%"
            boxShadow="none"
          >
            <CardHeader borderRadius={'8px'} pb="0">
              <Heading type="h5" color="greyscale.900">
                Employers are looking for these traits in candidates!
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="1rem">
                <Flex gap="1rem">
                  <Badge
                    variant={'primary'}
                    borderRadius={'1rem'}
                    padding="8px 12px"
                    maxHeight="34px"
                    alignSelf="center"
                  >
                    Reliability
                  </Badge>
                  <Text type="b2" color="greyscale.600" alignSelf="center">
                    Did <strong>{fullName}</strong> show up on time and work hard?
                  </Text>
                </Flex>
                <Flex gap="1rem">
                  <Badge
                    variant={'primary'}
                    borderRadius={'1rem'}
                    padding="8px 12px"
                    maxHeight="34px"
                    alignSelf="center"
                  >
                    Willingness-to-Learn
                  </Badge>
                  <Text type="b2" color="greyscale.600" alignSelf="center">
                    Is <strong>{fullName}</strong> willing to learn new skills?
                  </Text>
                </Flex>
                <Flex gap="1rem">
                  <Badge
                    variant={'primary'}
                    borderRadius={'1rem'}
                    padding="8px 12px"
                    maxHeight="34px"
                    alignSelf="center"
                  >
                    Adaptability
                  </Badge>
                  <Text type="b2" color="greyscale.600" alignSelf="center">
                    How has <strong>{fullName}</strong> shown they can take on new challenges?
                  </Text>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
          <Card
            bg="white"
            borderRadius={'0.5rem'}
            gap={'0.5rem'}
            border="1px solid var(--greyscale-grey-300, #DEE2E6)"
            boxShadow="none"
            w="100%"
          >
            <CardHeader borderRadius={'8px'} pb="0">
              <Heading type="h5" color="greyscale.900">
                Employers want to know what {fullName} has learned with you!
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {data?.programs?.map((program: any, index: number) => {
                  return (
                    <Flex key={index} gap="1rem" flexWrap="wrap" w="100%">
                      <Text color="greyscale.600" variant={'b1Bold'} w="100%">
                        {program.name}
                      </Text>
                      <Text type="b2" color="greyscale.600" w="100%">
                        {program.trainingProvider.name}
                      </Text>
                      {program.programSkill?.length > 0 && (
                        <Flex gap={'0.5rem'}>
                          {program.programSkill?.map((programSkill: any, index: any) => (
                            <Badge
                              variant={'primary'}
                              borderRadius={'1rem'}
                              key={index}
                              padding="8px 12px"
                            >
                              {programSkill.skill.skill}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Flex>
                  )
                })}
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}
