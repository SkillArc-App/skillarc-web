'use client'

import Milestones from '@/frontend/components/Timeline.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { useAllProgramData } from '@/frontend/hooks/useProgramData'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { useUserEvents } from '@/frontend/hooks/useUserEvents'
import { put } from '@/frontend/http-common'
import { GetOneProfileResponse } from '@/frontend/services/profile.service'
import { Button, Divider, HStack, Link, Select, Stack, Switch } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

export default function Seeker({ params: { seekerId } }: { params: { seekerId: string } }) {
  const {
    profileQuery: { data },
  } = useProfileData(seekerId)

  const {
    userEventsQuery: { data: userEvents },
  } = useUserEvents(data?.user_id)

  const {
    getAllTrainingProviders: { data: trainingProviders },
  } = useAllTrainingProviderData()

  const {
    getAllPrograms: { data: programs },
  } = useAllProgramData()

  const [trainingProviderId, setTrainingProviderId] = useState('')
  const [programId, setProgramId] = useState('')
  const [trainingProviderExisted, setTrainingProviderExisted] = useState(false)

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  const [workingProfile, setWorkingProfile] = useState<GetOneProfileResponse | undefined>()

  useEffect(() => {
    if (!data) return

    setWorkingProfile(data)
  }, [data])

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (data) {
      const stp = data.user.SeekerTrainingProvider?.at(0)
      if (stp?.training_provider_id) {
        setTrainingProviderExisted(true)
        setTrainingProviderId(stp.training_provider_id)
      }
      if (stp?.program_id) {
        setProgramId(stp.program_id)
      }
    }
  }, [data])

  const handleTrainingProviderChange = (e: any) => {
    setTrainingProviderId(e.target.value)
  }

  const handleProgramChange = (e: any) => {
    setProgramId(e.target.value)
  }

  const handleSubmit = async () => {
    if (!token) return

    if (trainingProviderExisted) {
      await axios.create({ withCredentials: false }).put(
        `${process.env.NEXT_PUBLIC_API_URL}/seekers/${seekerId}/training_providers/${trainingProviderId}`,
        { programId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    } else {
      await axios.create({ withCredentials: false }).post(
        `${process.env.NEXT_PUBLIC_API_URL}/seekers/${seekerId}/training_providers`,
        { programId, trainingProviderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    }
  }

  if (!data) return <>Loading...</>

  return (
    <Stack spacing={2}>
      <span>
        <b>Name: </b> {`${data.user.first_name} ${data.user.last_name}`}
      </span>
      <span>
        <b>Email: </b> {data.user.email}
      </span>
      <Divider />
      <span>
        <Stack spacing={2} direction={'row'}>
          <b>Training Provider: </b>
          <Select
            width={'20rem'}
            placeholder="Select option"
            onChange={handleTrainingProviderChange}
            size={'sm'}
            value={trainingProviderId}
          >
            {(trainingProviders || []).map((tp: { id: string; name: string }) => {
              return (
                <option value={tp.id} key={tp.id}>
                  {tp.name}
                </option>
              )
            })}
          </Select>
          <Select
            width={'20rem'}
            placeholder="Select option"
            onChange={handleProgramChange}
            size={'sm'}
            value={programId}
          >
            {(programs || []).map((p) => {
              return (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              )
            })}
          </Select>
          <Button size={'sm'} colorScheme="green" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </span>
      <Divider />
      <span>
        <b>Profile: </b>
        <Link as={NextLink} href={`/profiles/${data.id}`}>
          {data.id}
        </Link>
      </span>
      <Divider />
      <span>
        <b>Industry Interests: </b>
        {data.industryInterests.join(', ')}
      </span>
      <Divider />
      {workingProfile && (
        <HStack>
          <b>Met with a career coach: </b>
          <Switch
            isChecked={workingProfile.met_career_coach}
            onChange={(e) => {
              if (!workingProfile) return
              if (!token) return

              const met_career_coach = !workingProfile.met_career_coach

              setWorkingProfile({
                ...workingProfile,
                met_career_coach,
              })

              put(
                `/profiles/${workingProfile.id}`,
                {
                  met_career_coach,
                },
                token,
              )
            }}
          />
          {workingProfile.met_career_coach ? <p>Yes</p> : <p>No</p>}
        </HStack>
      )}
      <Divider />
      <Milestones userEvents={userEvents || []} />
    </Stack>
  )
}
