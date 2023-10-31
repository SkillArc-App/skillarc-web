'use client'

import { useAllEmployerData } from '@/frontend/hooks/useAllEmployerData'
import { useAllJobData } from '@/frontend/hooks/useJobData'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import {
  Box,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

export default function jobs() {
  const {
    getJobs: { data: jobs, refetch: refetchJobs },
  } = useAllJobData()

  const {
    getEmployers: { data: employers, isLoading: employersIsLoading, refetch },
  } = useAllEmployerData()

  const {
    masterCertificationQuery: { data: masterCertifications },
  } = useMasterCertificationData()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [employerId, setEmployerId] = useState('')
  const [employmentTitle, setEmploymentTitle] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [benefitsDescription, setBenefitsDescription] = useState('')
  const [responsibilitiesDescription, setResponsibilitiesDescription] = useState('')
  const [requirementsDescription, setRequirementsDescription] = useState('')
  const [workDays, setWorkDays] = useState('')
  const [schedule, setSchedule] = useState('')
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const handleEmployerIdChange = (e: any) => {
    setEmployerId(e.target.value)
  }

  const handleEmploymentTitleChange = (e: any) => {
    setEmploymentTitle(e.target.value)
  }

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value)
  }

  const handleEmploymentTypeChange = (e: any) => {
    setEmploymentType(e.target.value)
  }

  const handleBenefitsDescriptionChange = (e: any) => {
    setBenefitsDescription(e.target.value)
  }

  const handleResponsibilitiesDescriptionChange = (e: any) => {
    setResponsibilitiesDescription(e.target.value)
  }

  const handleRequirementsDescriptionChange = (e: any) => {
    setRequirementsDescription(e.target.value)
  }

  const handleWorkDaysChange = (e: any) => {
    setWorkDays(e.target.value)
  }

  const handleScheduleChange = (e: any) => {
    setSchedule(e.target.value)
  }

  const handleSubmit = () => {
    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        {
          employer_id: employerId,
          employment_title: employmentTitle,
          location,
          employment_type: employmentType,
          benefits_description: benefitsDescription,
          responsibilities_description: responsibilitiesDescription,
          requirements_description: requirementsDescription,
          work_days: workDays,
          schedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        refetchJobs()
        onClose()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!jobs) return <div>Loading...</div>

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Job
      </Button>
      <TableContainer>
        <Table size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Employer</Th>
              <Th># of Applicants</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link href={`/admin/jobs/${job.id}`} as={NextLink}>
                      {job.employment_title}
                    </Link>
                  </Td>
                  <Td>{job.employer.name}</Td>
                  <Td>{job.numberOfApplicants}</Td>
                  {/* TODO: Fix the fact that we're using the prisma job type, but this is actually a string */}
                  <Td>{new Date(job.created_at as unknown as string).toDateString()}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Seeker Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Select placeholder="Employer" onChange={handleEmployerIdChange}>
                {employers?.map((employer: { name: string; id: string }, index: number) => {
                  return (
                    <option key={index} value={employer.id}>
                      {employer.name}
                    </option>
                  )
                })}
              </Select>
              <Input placeholder="Employment Title" onChange={handleEmploymentTitleChange} />
              <Input placeholder="Location" onChange={handleLocationChange} />
              <Select placeholder="Employment Type" onChange={handleEmploymentTypeChange}>
                <option>FULLTIME</option>
                <option>PARTTIME</option>
              </Select>
              <Textarea
                placeholder="Benefits Description"
                onChange={handleBenefitsDescriptionChange}
              />
              <Textarea
                placeholder="Responsibilities Description"
                onChange={handleResponsibilitiesDescriptionChange}
              />
              <Textarea
                placeholder="Requirements Description"
                onChange={handleRequirementsDescriptionChange}
              />
              <Textarea placeholder="Work days" onChange={handleWorkDaysChange} />
              <Textarea placeholder="Schedule" onChange={handleScheduleChange} />
              {/* <Select placeholder="Certifications Learned">
                {masterCertifications?.map((c, index: number) => {
                  return (
                    <option key={index} value={c.id}>
                      {c.certification}
                    </option>
                  )
                })}
              </Select> */}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
