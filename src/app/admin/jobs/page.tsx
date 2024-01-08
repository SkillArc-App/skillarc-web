'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { useAllEmployerData } from '@/frontend/hooks/useAllEmployerData'
import { useAllJobData } from '@/frontend/hooks/useJobData'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import {
  Badge,
  Box,
  Button,
  Checkbox,
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

export default function Jobs() {
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

  const [filteredJobs, setFilteredJobs] = useState(jobs)

  const [employerId, setEmployerId] = useState('')
  const [employmentTitle, setEmploymentTitle] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [benefitsDescription, setBenefitsDescription] = useState('')
  const [responsibilitiesDescription, setResponsibilitiesDescription] = useState('')
  const [requirementsDescription, setRequirementsDescription] = useState('')
  const [workDays, setWorkDays] = useState('')
  const [schedule, setSchedule] = useState('')
  const [showHiddenJobs, setShowHiddenJobs] = useState(false)

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
    if (!jobs) return

    const filteredJobs = jobs.filter((job) => {
      if (showHiddenJobs) return true
      return !job.hide_job
    })

    setFilteredJobs(filteredJobs)
  }, [jobs, showHiddenJobs])

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

  const data =
    filteredJobs?.map((job) => {
      return {
        id: job.id,
        hidden: job.hide_job,
        title: job.employment_title,
        employer: job.employer.name,
        applicantCount: job.numberOfApplicants,
        createdAt: new Date(job.created_at as unknown as string).toDateString(),
      }
    }) ?? []

  const columnHelper = createColumnHelper<{
    id: string
    hidden: boolean
    title: string
    employer: string
    applicantCount: number
    createdAt: string
  }>()

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (row) => (
        <Link href={`/admin/jobs/${row.row.original.id}`} as={NextLink}>
          {row.row.original.hidden ? (
            <>
              <Badge colorScheme="red">Hidden</Badge> {row.getValue()}
            </>
          ) : (
            row.getValue()
          )}
        </Link>
      ),
    }),
    columnHelper.accessor('employer', {
      header: 'Employer',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('applicantCount', {
      header: '# of Applicants',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (row) => row.getValue(),
    }),
  ]

  if (!jobs) return <div>Loading...</div>

  return (
    <Box mt={'1rem'}>
      <Stack>
        <Box>
          <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
            + New Job
          </Button>
        </Box>
        <Checkbox isChecked={showHiddenJobs} onChange={() => setShowHiddenJobs(!showHiddenJobs)}>
          Show Hidden Jobs
        </Checkbox>

        <DataTable data={data} columns={columns} />
      </Stack>
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
