'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useEmployerJobData } from '@/frontend/hooks/useEmployerJobData'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { usePassReasons } from '@/frontend/hooks/usePassReasons'
import { put } from '@/frontend/http-common'
import { Applicant, Job } from '@/frontend/services/employerJobs.service'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  IconButton,
  Link,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import axios from 'axios'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaRegComment } from 'react-icons/fa6'

type ApplicantStatusChanges = {
  [key: string]: ApplicantStatusChange
}

type ApplicantStatusChange = {
  status: string
  reasons?: string[]
}

type ApplicantTable = {
  applicant: Applicant
  id: string
  name: string
  contactInfo: string
  job: string
  status: string
  appliedOn: string
}

const Jobs = () => {
  const router = useRouter()
  const jobId = useFixedParams('id')?.['id']

  const searchParams = useSearchParams()
  const employerId = searchParams?.get('employer_id')
  const terminalState = searchParams?.get('terminal_state')

  const showPasses = terminalState === 'show'

  const pathName = usePathname()

  const {
    getEmployerJobs: { data: employerJobs, refetch: refetchEmployerJobs, isLoading },
  } = useEmployerJobData()

  const {
    getPassReasons: { data: passReasons },
  } = usePassReasons()

  const [updatedStatuses, setUpdatedStatuses] = useState<ApplicantStatusChanges>({})
  const token = useAuthToken()

  const { onClose } = useDisclosure()

  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null)

  const groupedJobs =
    employerJobs?.jobs.reduce((groups, job) => {
      if (!groups[job.employerId]) {
        groups[job.employerId] = []
      }

      groups[job.employerId].push(job)

      return groups
    }, {} as Record<string, Job[]>) ?? {}

  const employers = Object.keys(groupedJobs).map((key) => {
    return {
      id: key,
      name: groupedJobs[key][0].employerName,
    }
  })

  const activeEmployerId = employerId
    ? employers.find((employer) => employer.id === employerId)?.id
    : employers[0]?.id ?? ''

  const jobs = employerJobs?.jobs.filter((job) => job.employerId === activeEmployerId)

  const jobIds = jobs?.map((job) => job.id)

  const currentJob = jobs?.find((job) => job.id === jobId)

  const filteredApplicants =
    employerJobs?.applicants.filter((applicant) => {
      if (!showPasses && (applicant.status === 'pass' || applicant.status === 'hire')) return false

      return applicant.jobId === jobId || (jobId === 'all' && jobIds?.includes(applicant.jobId))
    }) ?? []

  const data: ApplicantTable[] = filteredApplicants.map((applicant) => {
    return {
      applicant,
      id: applicant.id,
      name: `${applicant.firstName} ${applicant.lastName}`,
      contactInfo: `${applicant.email} ${applicant?.phoneNumber ?? ''}`,
      job: applicant.jobName,
      status: applicant.status,
      appliedOn: applicant.createdAt,
    }
  })

  const columnHelper = createColumnHelper<ApplicantTable>()

  const appliedOnId = 'applied-on'

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => (
        <Link href={info.row.original.applicant.profileLink} as={NextLink}>
          {info.row.original.applicant.firstName} {info.row.original.applicant.lastName}
        </Link>
      ),
      header: 'Name',
    }),
    columnHelper.accessor('contactInfo', {
      cell: (info) => info.getValue(),
      header: 'Contact Info',
    }),
    columnHelper.accessor('job', {
      cell: (info) => info.getValue(),
      header: 'Job',
    }),
    columnHelper.accessor('status', {
      cell: (info) => (
        <HStack>
          <Select
            onChange={(e) => handleUpdatedStatuses(info.row.original.applicant, e.target.value)}
            value={info.getValue()}
          >
            {['new', 'pending intro', 'intro made', 'interviewing', 'hire', 'pass'].map(
              (status) => {
                return (
                  <option value={status} key={status}>
                    {status}
                  </option>
                )
              },
            )}
          </Select>
          {true && (
            <IconButton
              aria-label="Start conversation with applicant"
              icon={<FaRegComment />}
              onClick={() => router.push(`/employers/chats/${info.row.original.id}`)}
            />
          )}
        </HStack>
      ),
      header: 'Status',
    }),
    columnHelper.accessor('appliedOn', {
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      id: appliedOnId,
      header: 'Applied On',
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: true,
      id: appliedOnId,
    },
  ]

  const handleApplicantUpdate = async (id: string) => {
    const applicantStatusChange = updatedStatuses[id]

    await axios.create({ withCredentials: false }).put(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/applicants/${id}`,
      { ...applicantStatusChange },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    refetchEmployerJobs()
  }

  const passOnApplicant = () => {
    if (!currentApplicant) return

    handleApplicantUpdate(currentApplicant.id)
    setCurrentApplicant(null)
  }

  const handleUpdatedStatuses = (applicant: Applicant, status: string) => {
    setUpdatedStatuses({
      ...updatedStatuses,
      [applicant.id]: { status },
    })

    if (status === 'pass') {
      setCurrentApplicant(applicant)
    } else {
      if (!token) return

      put(
        `${process.env.NEXT_PUBLIC_API_URL}/employers/applicants/${applicant.id}`,
        { status },
        token,
      ).then(() => {
        refetchEmployerJobs()
      })
    }
  }

  if (isLoading) return <LoadingPage />

  let tabIndex = 0
  if (jobs) {
    const matchJob = jobs.find((job) => job.id === jobId)

    if (matchJob) {
      tabIndex = jobs.indexOf(matchJob) + 1
    }
  }

  if (!activeEmployerId) return <LoadingPage />

  return (
    <Flex py={'1.5rem'} px={'1rem'} flexDir={'column'} gap={'0.5rem'} width={'100%'}>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Applicants
        {employers.length > 1 && (
          <select
            onChange={(e) => {
              router.push(
                `/employers/jobs/all?employer_id=${e.target.value}&terminal_state=${terminalState}`,
              )
            }}
            value={activeEmployerId}
          >
            {employers.map((employer) => {
              return (
                <option key={employer.id} value={employer.id}>
                  {employer.name}
                </option>
              )
            })}
          </select>
        )}
      </Heading>
      <Tabs index={tabIndex} variant="unstyled" colorScheme="gray" py={'12px'}>
        <TabList>
          <Tab
            _selected={{ color: 'white', bg: 'gray.900', borderRadius: 4 }}
            as={NextLink}
            href={`/employers/jobs/all?terminal_state=${terminalState}&employer_id=${
              employerId ?? ''
            }`}
          >
            All
          </Tab>
          {jobs &&
            jobs.map((job, index) => {
              return (
                <Tab
                  as={NextLink}
                  href={`/employers/jobs/${job.id}?terminal_state=${
                    terminalState ?? ''
                  }&employer_id=${employerId ?? ''}`}
                  key={index}
                  _selected={{ color: 'white', bg: 'gray.900', borderRadius: 4 }}
                >
                  {job.name}
                </Tab>
              )
            })}
        </TabList>
        <TabPanels></TabPanels>
      </Tabs>
      <Checkbox
        isChecked={showPasses}
        onChange={() => {
          if (showPasses) {
            router.replace(`${pathName}?terminal_state=`)
          } else {
            router.replace(`${pathName}?terminal_state=show`)
          }
        }}
      >
        Show Passes/Hires
      </Checkbox>
      <DataTable columns={columns} data={data} initialSortState={initialSortState} />
      <Drawer placement={'right'} isOpen={!!currentApplicant} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Give us Feedback</DrawerHeader>
          <DrawerBody>
            <Stack gap={'2rem'}>
              <Stack gap={'1rem'}>
                <p>Help us find better candidates for you in the future!</p>
              </Stack>
              <CheckboxGroup
                colorScheme="green"
                onChange={(e) => {
                  if (!currentApplicant) return

                  setUpdatedStatuses({
                    ...updatedStatuses,
                    [currentApplicant?.id]: {
                      status: 'pass',
                      reasons: e as string[],
                    },
                  })
                }}
              >
                <Stack>
                  {(passReasons || []).map((reason) => {
                    return (
                      <Checkbox key={reason.id} value={reason.id}>
                        {reason.description}
                      </Checkbox>
                    )
                  })}
                </Stack>
              </CheckboxGroup>
              <Button variant={'primary'} onClick={passOnApplicant}>
                Submit
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default withAuthenticationRequired(Jobs)
