import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useCoachSeekerData } from '@/frontend/hooks/useCoachSeekerData'
import { useCoachesData } from '@/frontend/hooks/useCoachesData'
import { post } from '@/frontend/http-common'
import {
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Link,
  Select,
  Stack,
  Tag,
  Textarea,
} from '@chakra-ui/react'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const NoteBox = ({ note }: { note: string }) => {
  return (
    <Box boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)" bg={'white'} py={'1rem'} px={'0.5rem'}>
      <Text variant={'b2'}>{note}</Text>
    </Box>
  )
}

const Seeker = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: seeker } = useCoachSeekerData(id as string)
  const { data: coaches } = useCoachesData()

  const [groupedNotes, setGroupedNotes] = useState<{ [key: string]: string[] }>({})
  const [noteDraft, setNoteDraft] = useState('')
  const [workingSeeker, setWorkingSeeker] = useState(seeker)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

  useEffect(() => {
    if (!seeker) return
    setWorkingSeeker(seeker)
  }, [seeker])

  useEffect(() => {
    if (!workingSeeker) return

    setGroupedNotes(
      workingSeeker.notes
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        .reduce((acc: { [key: string]: string[] }, curr) => {
          const month = new Date(curr.date).getMonth()
          const year = new Date(curr.date).getFullYear()

          const yearMonthDate = new Date(year, month).toString()

          const monthNotes = acc[yearMonthDate] || []

          return { ...acc, [yearMonthDate]: [...monthNotes, curr.note] }
        }, {}),
    )
  }, [workingSeeker])

  const addNote = () => {
    if (!token) return
    if (!noteDraft) return
    if (!workingSeeker) return

    const currentNoteDraft = noteDraft;
    const noteId = crypto.randomUUID();

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}/notes`,
      {
        note: currentNoteDraft,
        note_id: noteId,
      },
      token,
    ).then((res) => {
      setWorkingSeeker({
        ...workingSeeker,
        notes: [...workingSeeker.notes, { note: currentNoteDraft, noteId, date: new Date().toString() }],
      })

      setNoteDraft('')
    })
  }

  const changeSkillLevel = (level: string) => {
    if (!token) return
    if (!workingSeeker) return

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}/skill-levels`,
      {
        level,
      },
      token,
    ).then((res) => {
      setWorkingSeeker({
        ...workingSeeker,
        skillLevel: level,
      })
    })
  }

  const assignCoach = (coachId: string) => {
    if (!token) return
    if (!workingSeeker) return

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}/assign_coach`,
      {
        coach_id: coachId,
      },
      token,
    ).then((res) => {
      setWorkingSeeker({
        ...workingSeeker,
        assignedCoach: coachId,
      })
    })
  }

  if (!workingSeeker) return <></>

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
          <Stack p={'1rem'}>
            <Heading type="h3" color={'black'}>
              {workingSeeker.firstName} {workingSeeker.lastName}
            </Heading>
            <Divider />
            <Box mt={'1rem'}>
              <Link as={NextLink} href={`/profiles/${workingSeeker.seekerId}`}>
                Jump to Profile
              </Link>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Email</Text>
              <Text variant={'b2'} color={'black'}>
                {workingSeeker.email}
              </Text>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Phone Number</Text>
              <Text variant={'b2'} color={'black'}>
                {workingSeeker.phoneNumber}
              </Text>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Last Contacted</Text>
              <Text variant={'b2'} color={'black'}>
                {workingSeeker.lastContacted}
              </Text>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Stage</Text>
              <Text variant={'b2'} color={'black'}>
                {workingSeeker.stage}
              </Text>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Barriers</Text>
              {
                <HStack>
                  {workingSeeker.barriers.map((barrier, key) => (
                    <Tag key={key}>{barrier}</Tag>
                  ))}
                </HStack>
              }
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Skill Level</Text>
              <Select
                variant={'unstyled'}
                color={'black'}
                onChange={(e) => changeSkillLevel(e.target.value)}
                value={workingSeeker.skillLevel}
              >
                <option value="beginner">Beginner</option>
                <option value="advanced">Advanced</option>
              </Select>
            </Box>
            <Box mt={'1rem'}>
              <Text variant={'b3'}>Assigned Coach</Text>
              <Select
                variant={'unstyled'}
                color={'black'}
                onChange={(e) => assignCoach(e.target.value)}
                value={workingSeeker.assignedCoach}
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
                }
              }}
            />
            {Object.entries(groupedNotes)
              .sort((a, b) => {
                return new Date(b[0]).getTime() - new Date(a[0]).getTime()
              })
              .map(([date, notes]) => {
                return (
                  <Stack key={date}>
                    <Heading type="h3" color={'black'}>
                      {new Date(date).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Heading>
                    {notes.map((note, key) => {
                      return <NoteBox key={key} note={note} />
                    })}
                  </Stack>
                )
              })}
          </Stack>
        </GridItem>
        <GridItem pl="2" bg="gray.50" area={'right'}></GridItem>
      </Grid>
    </Box>
  )
}

export default withAuthenticationRequired(Seeker)
