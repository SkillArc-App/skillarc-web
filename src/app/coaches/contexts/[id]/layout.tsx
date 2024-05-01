'use client'

import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import { useCoachesData } from '@/app/coaches/hooks/useCoachesData'
import { SubmittableCoachTask } from '@/app/coaches/types'
import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { Barrier, useBarrierData } from '@/frontend/hooks/useBarrierData'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { post, put } from '@/frontend/http-common'
import { CheckIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Link,
  Select,
  Stack,
  Tab,
  TabList,
  Tabs,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ReactSelect from 'react-select'
import { useCoachJobs } from '../../hooks/useCoachJobs'
import { useCoachSeekerTasks } from '../../hooks/useCoachTasks'
import ReminderModal from '../../tasks/components/ReminderModal'

const tabs: Record<string, number> = {
  notes: 0,
  tasks: 1,
}

const Context = ({ children }: { children: React.ReactNode }) => {
  const { id } = useFixedParams('id')
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)
  const { data: coaches } = useCoachesData()
  const { data: barriers } = useBarrierData()
  const { data: allJobs } = useCoachJobs()
  const { refetch: refetchTasks } = useCoachSeekerTasks(id)
  const pathName = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const token = useAuthToken()
  const toast = useToast()

  const barrierOptions = (barriers ?? []).map((b) => ({
    value: b.id,
    label: b.name,
  }))

  const jobs = allJobs?.filter((job) => {
    return !seeker?.applications.some((a) => a.jobId === job.id)
  })

  const changeSkillLevel = async (level: string) => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/contexts/${id}/skill-levels`, { level }, token)

    refetchSeeker()
  }

  const assignCoach = async (coachId: string) => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/contexts/${id}/assign_coach`, { coachId }, token)

    refetchSeeker()
  }

  const recommendJob = async (jobId: string) => {
    if (!token) return
    if (!seeker) return
    if (!jobs) return

    if (!seeker.phoneNumber) {
      toast({
        title: 'Cannot recommend job without phone number',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    } else {
      await post(`/coaches/contexts/${id}/recommend_job`, { jobId }, token)

      refetchSeeker()
    }
  }

  const certifySeeker = async () => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/contexts/${id}/certify`, {}, token)

    refetchSeeker()
  }

  const updateBarriers = async (barriers: Barrier[]) => {
    if (!token) return
    if (!seeker) return

    await put(
      `/coaches/contexts/${id}/update_barriers`,
      {
        barriers: barriers.map((b) => b.id),
      },
      token,
    )

    refetchSeeker()
  }

  const handleSubmitReminder = async (reminder: SubmittableCoachTask) => {
    if (!token) return

    await post(`/coaches/tasks/reminders`, { reminder }, token)
    refetchTasks()

    setIsModalOpen(false)
  }

  const applicationIcon = (applicationStatus: string) => {
    if (applicationStatus == 'hire') {
      return <CheckIcon boxSize={3} color={'green'} />
    }

    if (applicationStatus == 'pass') {
      return <CloseIcon boxSize={3} color={'red'} />
    }

    return <TimeIcon boxSize={3} color={'gray'} />
  }

  if (!seeker) return <LoadingPage />

  const certifySeekerSection = () => {
    if (seeker.kind === 'lead') {
      return <Text variant={'b2'}>{`This seeker need to create a profile to be certified`}</Text>
    }

    return !!seeker.certifiedBy ? (
      <Text variant={'b2'}>{`By ${seeker.certifiedBy}`}</Text>
    ) : (
      <Button onClick={certifySeeker}>Certify</Button>
    )
  }

  const index = tabs[pathName.split('/').slice(-1)[0]] || 0

  return (
    <Box width={'100%'} height={'100%'}>
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contextId={id}
        onSubmit={handleSubmitReminder}
      />
      <Grid
        templateAreas={`"nav main right"`}
        gridTemplateColumns={'20rem 1fr 20rem'}
        gridTemplateRows={'100%'}
        height={'100%'}
        gap="1"
        color="blackAlpha.700"
        minHeight={0}
      >
        <GridItem pl="2" bg="white" area={'nav'}>
          <Stack p={'1rem'} spacing="1rem">
            <Breadcrumb>
              <BreadcrumbItem>
                {seeker.kind === 'seeker' ? (
                  <BreadcrumbLink as={NextLink} href="/coaches/seekers">
                    {'< Back to Seekers'}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink as={NextLink} href="/coaches/leads">
                    {'< Back to Leads'}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading type="h3" color={'black'}>
              {seeker.firstName} {seeker.lastName}
            </Heading>
            <Divider />
            {seeker.seekerId && (
              <Box>
                <Link as={NextLink} href={`/profiles/${seeker.seekerId}`}>
                  Jump to Profile
                </Link>
              </Box>
            )}
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
            <Stack>
              <Text variant={'b3'}>Seeker Certification</Text>
              {certifySeekerSection()}
            </Stack>
            <Stack>
              <Text variant={'b3'}>Seeker Reminder</Text>
              <Button onClick={() => setIsModalOpen(true)}>Create Reminder</Button>
            </Stack>
            <Box>
              <Text variant={'b3'} mb={'0.25rem'}>
                Barriers
              </Text>
              <ReactSelect
                isMulti
                options={barrierOptions}
                onChange={(v) => updateBarriers(v.map((b) => ({ id: b.value, name: b.label })))}
                value={seeker.barriers.map((b) => ({ value: b.id, label: b.name }))}
              />
            </Box>
            <Box>
              <Text variant={'b3'}>Skill Level</Text>
              <Select
                variant={'unstyled'}
                color={'black'}
                onChange={(e) => changeSkillLevel(e.target.value)}
                value={seeker.skillLevel}
              >
                <option value="beginner">Beginner</option>
                <option value="advanced">Advanced</option>
              </Select>
            </Box>
            <Box>
              <Text variant={'b3'}>Assigned Coach</Text>
              <Select
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
          </Stack>
        </GridItem>
        <GridItem pl="2" pt={'1rem'} bg="gray.50" area={'main'} height={'100%'}>
          <Tabs my={'1rem'} variant={'enclosed'} index={index}>
            <TabList>
              <Tab as={NextLink} href={'notes'}>
                Notes
              </Tab>
              <Tab as={NextLink} href={'tasks'}>
                Seeker Tasks
              </Tab>
            </TabList>
          </Tabs>
          {children}
        </GridItem>
        <GridItem pl="2" bg="gray.50" area={'right'}>
          <Stack gap={'1rem'} p={'2rem'} overflowY={'scroll'}>
            <Box>
              <Heading type="h3" color={'black'}>
                Applications
              </Heading>
              <Divider />
            </Box>
            {seeker.applications.map(({ employerName, employmentTitle, status, jobId }) => (
              <Stack p={'1rem'} key={jobId} bg="white" height={'100%'}>
                <Box>
                  <Text variant={'b3'}>Employer</Text>
                  <Text variant={'b2'} color={'black'}>
                    {employerName}
                  </Text>
                </Box>
                <Box mt={'1rem'}>
                  <Text variant={'b3'}>Job Title</Text>
                  <Link variant={'b2'} as={NextLink} href={`/jobs/${jobId}`}>
                    {employmentTitle}
                  </Link>
                </Box>
                <Box mt={'1rem'}>
                  <Text variant={'b3'}>Application Status</Text>
                  <HStack>
                    {applicationIcon(status)}
                    <Text variant={'b2'} color={'black'}>
                      {status}
                    </Text>
                  </HStack>
                </Box>
              </Stack>
            ))}
            <Stack>
              <Heading type="h3" color={'black'}>
                Other Jobs
              </Heading>
              <Divider />
              {(jobs || []).map((job) => (
                <Stack gap={'1rem'} p={'1rem'} key={job.id} bg="white" height={'100%'}>
                  <Box>
                    <Text variant={'b3'}>Employer</Text>
                    <Link variant={'b2'} as={NextLink} href={`/jobs/`}>
                      {job.employerName}
                    </Link>
                  </Box>
                  <Box>
                    <Text variant={'b3'}>Job Title</Text>
                    <Link variant={'b2'} as={NextLink} href={`/jobs/`}>
                      {job.employmentTitle}
                    </Link>
                  </Box>
                  <Box>
                    {seeker.jobRecommendations.includes(job.id) ? (
                      <i>Recommended</i>
                    ) : (
                      <Button onClick={() => recommendJob(job.id)} variant={'solid'} size={'sm'}>
                        Recommend
                      </Button>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Context
