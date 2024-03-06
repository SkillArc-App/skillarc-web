'use client'

import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import { useCoachesData } from '@/app/coaches/hooks/useCoachesData'
import { SeekerNote } from '@/app/coaches/types'
import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { NoteBox } from '@/frontend/components/note-box'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { Barrier, useBarrierData } from '@/frontend/hooks/useBarrierData'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { destroy, post, put } from '@/frontend/http-common'
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
  Textarea,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
import ReactSelect from 'react-select'
import { useCoachJobs } from '../../hooks/useCoachJobs'

interface GroupedNotes {
  [key: string]: SeekerNote[]
}

const Seeker = () => {
  const { id } = useFixedParams('id')
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)
  const { data: coaches } = useCoachesData()
  const { data: barriers } = useBarrierData()
  const { data: allJobs } = useCoachJobs()

  const [noteDraft, setNoteDraft] = useState('')

  const token = useAuthToken()
  const toast = useToast()

  const groupedNotes = (seeker?.notes ?? [])
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .reduce((acc: GroupedNotes, curr) => {
      const month = new Date(curr.date).getMonth()
      const year = new Date(curr.date).getFullYear()

      const yearMonthDate = new Date(year, month).toString()

      const monthNotes = acc[yearMonthDate] || []

      return { ...acc, [yearMonthDate]: [...monthNotes, curr] }
    }, {})

  const barrierOptions = (barriers ?? []).map((b) => ({
    value: b.id,
    label: b.name,
  }))

  const jobs = allJobs?.filter((job) => {
    return !seeker?.applications.some((a) => a.jobId === job.id)
  })

  const addNote = async () => {
    if (!token) return
    if (!noteDraft) return
    if (!seeker) return

    const currentNoteDraft = noteDraft
    const noteId = crypto.randomUUID()

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/notes`,
      {
        note: currentNoteDraft,
        noteId,
      },
      token,
    )

    refetchSeeker()
    setNoteDraft('')
  }

  const deleteNote = async (noteId: string) => {
    if (!token) return
    if (!seeker) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/notes/${noteId}`,
      token,
    )

    refetchSeeker()
  }

  const modifyNote = async (noteId: string, updatedNote: string) => {
    if (!token) return
    if (!seeker) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/notes/${noteId}`,
      {
        note: updatedNote,
      },
      token,
    )

    refetchSeeker()
  }

  const changeSkillLevel = async (level: string) => {
    if (!token) return
    if (!seeker) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/skill-levels`,
      { level },
      token,
    )

    refetchSeeker()
  }

  const assignCoach = async (coachId: string) => {
    if (!token) return
    if (!seeker) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/assign_coach`,
      { coachId },
      token,
    )

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
      await post(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/recommend_job`,
        { jobId },
        token,
      )

      refetchSeeker()
    }
  }

  const certifySeeker = async () => {
    if (!token) return
    if (!seeker) return

    await post(`${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/certify`, {}, token)

    refetchSeeker()
  }

  const updateBarriers = async (barriers: Barrier[]) => {
    if (!token) return
    if (!seeker) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/contexts/${id}/update_barriers`,
      {
        barriers: barriers.map((b) => b.id),
      },
      token,
    )

    refetchSeeker()
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

  return (
    <Box width={'100%'} height={'100%'}>
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
            <Box>
              <Link as={NextLink} href={`/profiles/${seeker.seekerId}`}>
                Jump to Profile
              </Link>
            </Box>
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
          <Stack pr={'1rem'} pb={'10rem'} gap={'1rem'} overflowY={'scroll'} height={'100%'}>
            <Textarea
              placeholder="Add a note"
              bg={'white'}
              onChange={(e) => {
                setNoteDraft(e.target.value)
              }}
              value={noteDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNote()
                  e.preventDefault()
                }
              }}
            />
            {Object.entries(groupedNotes)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([date, notes]) => (
                <Stack key={date}>
                  <Heading type="h3" color={'black'}>
                    {new Date(date).toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Heading>
                  {notes.map((note) => (
                    <NoteBox
                      key={note.noteId}
                      note={note}
                      onDeleteClicked={deleteNote}
                      onNoteModified={modifyNote}
                    />
                  ))}
                </Stack>
              ))}
          </Stack>
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

export default Seeker
