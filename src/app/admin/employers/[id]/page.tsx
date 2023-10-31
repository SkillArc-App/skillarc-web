'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useEmployerData } from '@/frontend/hooks/useEmployerData'
import { useAuth0 } from '@auth0/auth0-react'
import { EditIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Employer({ params: { id } }: { params: { id: string } }) {
  const {
    getEmployer: { data: employer, refetch },
  } = useEmployerData(id as string)

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [name, setName] = useState<string>()
  const [logoUrl, setLogoUrl] = useState<string>()
  const [bio, setBio] = useState<string>()
  const [location, setLocation] = useState<string>()
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (!employer) return

    setName(employer.name)
    setLogoUrl(employer.logo_url ?? '')
    setBio(employer.bio)
    setLocation(employer.location ?? '')
  }, [employer])

  const handleNameChange = (e: any) => {
    setName(e.target.value)
  }

  const handleLogoUrlChange = (e: any) => {
    setLogoUrl(e.target.value)
  }

  const handleBioChange = (e: any) => {
    setBio(e.target.value)
  }

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value)
  }

  const handleSubmit = async () => {
    await axios.create({ withCredentials: false }).put(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/${id}`,
      {
        name,
        logo_url: logoUrl,
        bio,
        location,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    refetch()
    onClose()
  }

  if (!employer) return <LoadingPage />

  return (
    <Stack spacing={2}>
      <div>
        <b>Employer</b>: {employer.name}
      </div>
      <div>
        <b>Bio</b>: {employer.bio}
      </div>
      <div>
        <b>Location</b>: {employer.location}
      </div>
      <div>
        <b>Logo URL</b>: {employer.logo_url}
      </div>
      <Flex>
        <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
          edit
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Seeker Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input value={name} placeholder="Name" onChange={handleNameChange} />
              <Input value={logoUrl} placeholder="Logo URL" onChange={handleLogoUrlChange} />
              <Input value={location} placeholder="Location" onChange={handleLocationChange} />
              <Textarea value={bio} placeholder="Bio" onChange={handleBioChange} />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}
