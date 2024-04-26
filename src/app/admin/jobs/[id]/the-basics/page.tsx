'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { put } from '@/frontend/http-common'
import { EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
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
  Switch,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const TheBasicsPage = () => {
  const { id } = useFixedParams('id')
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const { data: employers } = useAllEmployers()
  const token = useAuthToken()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [category, setCategory] = useState<string>(job?.category ?? '')
  const [employerId, setEmployerId] = useState(job?.employer.id)
  const [employmentTitle, setEmploymentTitle] = useState(job?.employmentTitle)
  const [location, setLocation] = useState(job?.location)
  const [employmentType, setEmploymentType] = useState(job?.employmentType)
  const [benefitsDescription, setBenefitsDescription] = useState(job?.benefitsDescription)
  const [responsibilitiesDescription, setResponsibilitiesDescription] = useState(
    job?.responsibilitiesDescription,
  )
  const [requirementsDescription, setRequirementsDescription] = useState(
    job?.requirementsDescription,
  )
  const [workDays, setWorkDays] = useState(job?.workDays)
  const [schedule, setSchedule] = useState(job?.schedule)
  const [hideJob, setHideJob] = useState(job?.hideJob)

  useEffect(() => {
    if (!job) return

    setCategory(job.category)
    setEmployerId(job.employer.id)
    setEmploymentTitle(job.employmentTitle)
    setLocation(job.location)
    setEmploymentType(job.employmentType)
    setBenefitsDescription(job.benefitsDescription)
    setResponsibilitiesDescription(job.responsibilitiesDescription)
    setRequirementsDescription(job.requirementsDescription)
    setWorkDays(job.workDays)
    setSchedule(job.schedule)
    setHideJob(job.hideJob)
  }, [job])

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

  const onSubmit = async () => {
    if (!token) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${id}`,
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
        hide_job: hideJob,
      },
      token,
    )
    refetchJob()
    onClose()
  }

  if (!job) return <></>

  return (
    <Stack m={'1rem'} spacing={'1rem'}>
      <Flex>
        <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
          edit
        </Button>
      </Flex>
      <Box>
        <b>Category</b>: {job.category}
      </Box>
      <Box>
        <b>Employer</b>:{' '}
        <Link href={`/admin/employers/${job.employer.id}`} as={NextLink}>
          {job.employer?.name}
        </Link>
      </Box>
      <Box>
        <b>Employment Title</b>: {job.employmentTitle}
      </Box>
      <Box>
        <b>Location</b>: {job.location}
      </Box>
      <Box>
        <b>Employment Type</b>: {job.employmentType}
      </Box>
      <Box>
        <b>Benefits Description</b>:<ReactMarkdown>{job.benefitsDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Responsibilities Description</b>:
        <ReactMarkdown>{job.responsibilitiesDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Requirements Description</b>:
        <ReactMarkdown>{job.requirementsDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Work Days</b>: {job.workDays}
      </Box>
      <Box>
        <b>Schedule</b>: {job.schedule}
      </Box>
      <Box>
        <b>Hidden</b>: {job.hideJob ? 'Yes' : 'No'}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Seeker Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
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
              <Select
                placeholder="Employer"
                value={employerId}
                onChange={(e) => setEmployerId(e.target.value)}
              >
                {employers?.map((employer: { id: string; name: string }, index: number) => {
                  return (
                    <option value={employer.id} key={employer.id}>
                      {employer.name}
                    </option>
                  )
                })}
              </Select>
              <Input
                value={employmentTitle}
                onChange={(e) => setEmploymentTitle(e.target.value)}
                placeholder="Employment Title"
              />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
              <Input
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as 'FULLTIME' | 'PARTTIME')}
                placeholder="Employment Type"
              />
              <Textarea
                value={benefitsDescription}
                onChange={(e) => setBenefitsDescription(e.target.value)}
                placeholder="Benefits Description"
              />
              <Textarea
                value={responsibilitiesDescription ?? ''}
                onChange={(e) => setResponsibilitiesDescription(e.target.value)}
                placeholder="Responsibilities Description"
              />
              <Textarea
                value={requirementsDescription ?? ''}
                onChange={(e) => setRequirementsDescription(e.target.value)}
                placeholder="Requirements Description"
              />
              <Input
                value={workDays ?? ''}
                onChange={(e) => setWorkDays(e.target.value)}
                placeholder="Work Days"
              />
              <Input
                value={schedule ?? ''}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Schedule"
              />
              <span>
                Hide Job: <Switch isChecked={hideJob} onChange={() => setHideJob(!hideJob)} />
              </span>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>{' '}
    </Stack>
  )
}

export default TheBasicsPage
