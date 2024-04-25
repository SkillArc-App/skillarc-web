import { AdminJob } from '@/frontend/services/jobs.service'
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
} from '@chakra-ui/react'
import NextLink from 'next/link'
import ReactMarkdown from 'react-markdown'

const TheBasics = ({
  category,
  categoryOptions,
  employerId,
  employmentTitle,
  location,
  employmentType,
  benefitsDescription,
  responsibilitiesDescription,
  requirementsDescription,
  workDays,
  schedule,
  employers,
  handleHideJobChange,
  job,
  isOpen,
  onSubmit,
  onClose,
  onOpen,
  setCategory,
  setLocation,
  setEmploymentTitle,
  setEmployerId,
  setEmploymentType,
  setBenefitsDescription,
  setResponsibilitiesDescription,
  setRequirementsDescription,
  setWorkDays,
  setSchedule,
  hideJob,
}: {
  category: string
  categoryOptions: { value: string; label: string }[]
  employerId: string
  employmentTitle: string
  location: string
  employmentType: 'FULLTIME' | 'PARTTIME'
  benefitsDescription: string
  responsibilitiesDescription: string
  requirementsDescription: string
  workDays: string
  schedule: string
  employers: { id: string; name: string }[]
  job: AdminJob
  isOpen: boolean
  handleHideJobChange: () => void
  onClose: () => void
  onOpen: () => void
  onSubmit: () => void
  setCategory: (category: string) => void
  setLocation: (location: string) => void
  setEmploymentTitle: (employmentTitle: string) => void
  setEmployerId: (employerId: string) => void
  setEmploymentType: (employmentType: 'FULLTIME' | 'PARTTIME') => void
  setBenefitsDescription: (benefitsDescription: string) => void
  setResponsibilitiesDescription: (responsibilitiesDescription: string) => void
  setRequirementsDescription: (requirementsDescription: string) => void
  setWorkDays: (workDays: string) => void
  setSchedule: (schedule: string) => void
  hideJob: boolean
}) => {
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
                Hide Job: <Switch isChecked={hideJob} onChange={handleHideJobChange} />
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

export default TheBasics
