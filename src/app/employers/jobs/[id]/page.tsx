'use client'

import { ReasonResponse } from '@/common/types/ApplicantStatus'
import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useEmployerJobData } from '@/frontend/hooks/useEmployerJobData'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { usePassReasons } from '@/frontend/hooks/usePassReasons'
import { put } from '@/frontend/http-common'
import { Applicant, Job } from '@/frontend/services/employerJobs.service'
import {
  Box,
  Checkbox,
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
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaUserCheck } from 'react-icons/fa'
import { FaRegComment } from 'react-icons/fa6'
import { PassFeedback } from './components/PassFeedback'

type ApplicantStatusChanges = {
  [key: string]: ApplicantStatusChange
}

type ApplicantStatusChange = {
  status: string
  reasons?: ReasonResponse[]
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

  const { data: passReasons } = usePassReasons()

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

  const filteredApplicants =
    employerJobs?.applicants.filter((applicant) => {
      if (!showPasses && (applicant.status === 'pass' || applicant.status === 'hire')) return false

      return applicant.jobId === jobId || (jobId === 'all' && jobIds?.includes(applicant.jobId))
    }) ?? []

  const columnHelper = createColumnHelper<Applicant>()

  const appliedOnId = 'applied-on'

  const columns = [
    columnHelper.accessor('profileLink', {
      cell: (info) => (
        <Link href={info.getValue()}>
          {info.row.original.firstName} {info.row.original.lastName}
        </Link>
      ),
      header: 'Name',
    }),
    columnHelper.accessor('email', {
      cell: (info) => `${info.getValue()} ${info.row.original.phoneNumber ?? ''}`,
      header: 'Contact Info',
    }),
    columnHelper.accessor('jobName', {
      cell: (info) => info.getValue(),
      header: 'Job',
    }),
    columnHelper.accessor('certifiedBy', {
      cell: (info) => {
        const certifiedBy = info.getValue()

        return (
          !!certifiedBy && (
            <HStack justify={'center'}>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Box>
                    <FaUserCheck />
                  </Box>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>Certified By: {certifiedBy}</PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          )
        )
      },
      header: 'Certified',
    }),
    columnHelper.accessor('status', {
      cell: (info) => (
        <HStack>
          <Select
            onChange={(e) => handleUpdatedStatuses(info.row.original, e.target.value)}
            id={info.row.original.id}
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
    columnHelper.accessor('statusReasons', {
      cell: (info) => info.getValue()[0] ?? '',
      header: 'Pass Reason',
    }),
    columnHelper.accessor('createdAt', {
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

  const passOnApplicant = async (responses: ReasonResponse[]) => {
    if (!currentApplicant) return
    if (!token) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/applicants/${currentApplicant.id}`,
      { status: 'pass', reasons: responses },
      token,
    )

    refetchEmployerJobs()
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
        { camel: false },
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

  console.log('Re-Render')
  if (!activeEmployerId) return <LoadingPage />

  return (
    <Flex py={'1.5rem'} px={'1rem'} flexDir={'column'} gap={'0.5rem'} width={'100%'}>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Applicants
        {employers.length > 1 && (
          <select
            name="employer_select"
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
        name="Show or Hide Applicants"
        onChange={() => {
          if (showPasses) {
            router.replace(`${pathName}?terminal_state=&employer_id=${employerId ?? ''}`)
          } else {
            router.replace(`${pathName}?terminal_state=show&employer_id=${employerId ?? ''}`)
          }
        }}
      >
        Show Passes/Hires
      </Checkbox>
      <DataTable columns={columns} data={filteredApplicants} initialSortState={initialSortState} />
      <Drawer placement={'right'} isOpen={!!currentApplicant} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Give us Feedback</DrawerHeader>
          <DrawerBody>
            {passReasons && (
              <PassFeedback passReasons={passReasons} onApplicantPass={passOnApplicant} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default withAuthenticationRequired(Jobs)
