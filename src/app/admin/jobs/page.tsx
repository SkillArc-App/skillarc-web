'use client'

import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import DataTable from '@/frontend/components/DataTable.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useState } from 'react'
import { useAllAdminJobs } from '../hooks/useAllAdminJobs'

export default function Jobs() {
  const { data: jobs, refetch: refetchJobs } = useAllAdminJobs()
  const { data: employers } = useAllEmployers()

  const categoryOptions = [
    {
      value: 'marketplace',
      label: 'Marketplace',
    },
    {
      value: 'staffing',
      label: 'Staffing',
    },
  ]

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [category, setCategory] = useState(categoryOptions[0].value)
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

  const token = useAuthToken()

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

  const handleSubmit = async () => {
    if (!token) return

    await post(
      `/admin/jobs`,
      {
        category,
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
      token,
    )

    await refetchJobs()

    onClose()
  }

  const data = (jobs ?? [])
    .filter((job) => (showHiddenJobs ? true : !job.hideJob))
    .map((job) => {
      return {
        id: job.id,
        hidden: job.hideJob,
        title: job.employmentTitle,
        employer: job.employer.name,
        applicantCount: job.numberOfApplicants,
        createdAt: new Date(job.createdAt).toDateString(),
      }
    })

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
      filterFn: 'includesString',
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
    columnHelper.accessor('id', {
      header: 'Seeker View',
      cell: (row) =>
        row.row.original.hidden ? (
          'Hidden'
        ) : (
          <Link href={`/jobs/${row.getValue()}`} as={NextLink}>
            Seeker View
          </Link>
        ),
    }),
    columnHelper.accessor('employer', {
      header: 'Employer',
      filterFn: 'includesString',
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
          <ModalHeader>New Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3} aria-label="job-category">
              <RadioGroup value={category} onChange={(e) => setCategory(e)}>
                <Stack>
                  {categoryOptions.map((category, index) => {
                    return (
                      <Radio key={index} value={category.value}>
                        {category.label}
                      </Radio>
                    )
                  })}
                </Stack>
              </RadioGroup>
              <Divider />
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
