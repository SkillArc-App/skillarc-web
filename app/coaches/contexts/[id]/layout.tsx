'use client'

import { useCoachSeekerData } from '@/coaches/hooks/useCoachSeekerData'
import { useCoachesData } from '@/coaches/hooks/useCoachesData'
import { SubmittableCoachTask } from '@/coaches/types'
import { IdParams } from '@/common/types/PageParams'
import { Heading } from '@/components/Heading'
import { LoadingPage } from '@/components/Loading'
import { Text } from '@/components/Text.component'
import { useAuthToken } from '@/hooks/useAuthToken'
import { destroy, post } from '@/http-common'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Link,
  Select,
  Spacer,
  Stack,
  Tab,
  TabList,
  Tabs,
  Tag,
  Tooltip,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'
import { FaBullhorn, FaPlus, FaRegBell, FaTrash } from 'react-icons/fa6'
import { useCoachAttributes } from '../../hooks/useCoachAttributes'
import { useCoachSeekerTasks } from '../../hooks/useCoachTasks'
import AttributeModal, { AttributeForm } from '../../tasks/components/AttributeModal'
import RecommendForJobModal from '../../tasks/components/RecommendForJobModal'
import ReminderModal from '../../tasks/components/ReminderModal'

const tabs: Record<string, number> = {
  notes: 0,
  tasks: 1,
  jobs: 2,
  resumes: 3,
  screeners: 4,
}

const Context = ({ children, params: { id } }: { children: React.ReactNode } & IdParams) => {
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)
  const { data: coaches } = useCoachesData()
  const { refetch: refetchTasks } = useCoachSeekerTasks(id)
  const { data: attributes } = useCoachAttributes()
  const pathName = usePathname()

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false)
  const [isRecForJobModalOpen, setIsRecForJobModalOpen] = useState(false)

  const [workingValue, setWorkingValue] = useState<AttributeForm | undefined>(undefined)

  const token = useAuthToken()

  const assignCoach = async (coachId: string) => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/contexts/${id}/assign_coach`, { coachId }, token)

    refetchSeeker()
  }

  const certifySeeker = async () => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/seekers/${seeker.id}/certify`, {}, token)

    refetchSeeker()
  }

  const addAttribute = async (workingValue: AttributeForm | undefined = undefined) => {
    setWorkingValue(workingValue)
    setIsAttributeModalOpen(true)
  }

  const removeAttribute = async (seekerAttributeId: string) => {
    if (!token) return
    if (!seeker) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}/attributes/${seekerAttributeId}`,
      token,
    )

    refetchSeeker()
  }

  const handleSubmitReminder = async (reminder: SubmittableCoachTask) => {
    if (!token) return

    await post(`/coaches/tasks/reminders`, { reminder }, token)
    refetchTasks()

    setIsReminderModalOpen(false)
  }

  if (!seeker || !attributes) return <LoadingPage />

  const index = tabs[pathName.split('/').slice(-1)[0]] || 0

  return (
    <Box overflow={'clip'}>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        contextId={id}
        onSubmit={handleSubmitReminder}
      />
      <AttributeModal
        attributes={attributes}
        isOpen={isAttributeModalOpen}
        seekerId={id}
        onClose={() => setIsAttributeModalOpen(false)}
        refetchSeeker={refetchSeeker}
        workingValue={workingValue}
      />
      <RecommendForJobModal
        seekerId={id}
        isOpen={isRecForJobModalOpen}
        onClose={() => setIsRecForJobModalOpen(false)}
      />
      <Grid
        templateAreas={`"nav main right"`}
        gridTemplateColumns={'20rem 1fr'}
        gap="1"
        color="blackAlpha.700"
        height={'100%'}
      >
        <GridItem area={'nav'} overflow={'scroll'}>
          <Stack marginBottom={'1rem'}>
            <Stack p={'1rem'} bg={'white'} spacing="1rem">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink as={NextLink} href="/coaches/seekers">
                    {'< Back to Seekers'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <HStack gap={0}>
                <Heading type="h3" color={'black'}>
                  <Link as={NextLink} href={`/profiles/${seeker.id}`}>
                    {seeker.firstName} {seeker.lastName}
                  </Link>
                </Heading>
                {!!seeker.certifiedBy ? (
                  <Tooltip label={`certified by ${seeker.certifiedBy}`}>
                    <Box
                      px={'0.5rem'}
                      display={'flex'}
                      flexDirection={'column'}
                      alignContent={'center'}
                    >
                      <Icon as={FaThumbsUp} color="green" boxSize={4} />
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip label={'Certify Seeker'}>
                    <IconButton
                      size={'sm'}
                      onClick={certifySeeker}
                      aria-label="certify"
                      variant={'ghost'}
                      icon={<FaRegThumbsUp />}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Create Reminder">
                  <IconButton
                    size={'sm'}
                    onClick={() => setIsReminderModalOpen(true)}
                    aria-label="create-reminder"
                    variant={'ghost'}
                    icon={<FaRegBell />}
                  />
                </Tooltip>
                <Tooltip label="Recommend for Job">
                  <IconButton
                    size={'sm'}
                    onClick={() => setIsRecForJobModalOpen(true)}
                    aria-label="recommend-for-job"
                    variant={'ghost'}
                    icon={<FaBullhorn />}
                  />
                </Tooltip>
              </HStack>
              <Box>
                <Text variant={'b3'}>Assigned Coach</Text>
                <Select
                  size={'xs'}
                  variant={'unstyled'}
                  color={'black'}
                  onChange={(e) => assignCoach(e.target.value)}
                  value={coaches?.find((c) => c.email === seeker.assignedCoach)?.id}
                >
                  <option value=""></option>
                  {coaches?.map((coach, key) => (
                    <option key={key} value={coach.id}>
                      {coach.email}
                    </option>
                  ))}
                </Select>
              </Box>

              <Divider />
              <Box>
                <Text variant={'b3'}>Email</Text>
                <Text variant={'b2'} color={'black'}>
                  {seeker.email}
                </Text>
              </Box>
              <Box>
                <Text variant={'b3'}>Phone Number</Text>
                <Text variant={'b2'} color={'black'}>
                  {seeker.phoneNumber}
                </Text>
              </Box>
              <Box>
                <Text variant={'b3'}>Kind</Text>
                <Text variant={'b2'} color={'black'}>
                  {seeker.kind}
                </Text>
              </Box>
              <Box>
                <Text variant={'b3'}>Lead Captured By</Text>
                <Text variant={'b2'} color={'black'}>
                  {`${seeker.leadCapturedBy}: ${new Date(seeker.leadCapturedAt).toLocaleDateString()}`}
                </Text>
              </Box>
              <Box>
                <Text variant={'b3'}>Last On</Text>
                <Text variant={'b2'} color={'black'}>
                  {seeker.lastActiveOn}
                </Text>
              </Box>

              <Box>
                <Text variant={'b3'}>Last Contacted</Text>
                <Text variant={'b2'} color={'black'}>
                  {seeker.lastContacted}
                </Text>
              </Box>
            </Stack>
            <Stack>
              <HStack>
                <Heading type="h3" color={'black'}>
                  Attributes
                </Heading>
                <IconButton
                  size={'sm'}
                  onClick={() => addAttribute()}
                  aria-label="add-attribute"
                  variant={'ghost'}
                  icon={<FaPlus />}
                />
              </HStack>
              {seeker.attributes.map((a, i) => {
                return (
                  <Box key={i} bg={'white'} p={'1rem'}>
                    <HStack>
                      <Stack>
                        <Link
                          onClick={() => addAttribute()} // TODO: add in working value here
                        >
                          <Text variant={'b3'}>{a.name}</Text>
                        </Link>
                        <HStack>
                          {a.value.map((v) => {
                            return <Tag key={v}>{v}</Tag>
                          })}
                        </HStack>
                      </Stack>
                      <Spacer />
                      <IconButton
                        onClick={() => removeAttribute(a.id)}
                        size={'sm'}
                        aria-label="delete-attribute"
                        variant={'ghost'}
                        icon={<FaTrash />}
                      />
                    </HStack>
                  </Box>
                )
              })}
            </Stack>
          </Stack>
        </GridItem>
        <GridItem pl="2" pt={'1rem'} area={'main'} overflowY={'scroll'}>
          <Tabs variant={'enclosed'} index={index}>
            <TabList>
              <Tab as={NextLink} href={'notes'}>
                Notes
              </Tab>
              <Tab as={NextLink} href={'tasks'}>
                Seeker Tasks
              </Tab>
              <Tab as={NextLink} href={'jobs'}>
                Job Statuses
              </Tab>
              <Tab as={NextLink} href={'resumes'}>
                Resumes
              </Tab>
              <Tab as={NextLink} href={'screeners'}>
                Screeners
              </Tab>
            </TabList>
          </Tabs>
          <Box py={'1rem'}>{children}</Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Context
