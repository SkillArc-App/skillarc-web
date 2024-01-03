'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useEmployerJobData } from '@/frontend/hooks/useEmployerJobData'
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
import { createColumnHelper } from '@tanstack/react-table'
import axios from 'axios'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { groupBy } from 'lodash'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaRegComment } from 'react-icons/fa6'

type ApplicantStatusChanges = {
  [key: string]: ApplicantStatusChange
}

type ApplicantStatusChange = {
  status: string
  reasons?: string[]
}

const jobs = () => {
  const router = useRouter()
  const jobId: string | undefined = router.query.id?.at(0)

  const {
    getEmployerJobs: { data: employerJobs, refetch: refetchEmployerJobs, isLoading },
  } = useEmployerJobData()

  const {
    getPassReasons: { data: passReasons },
  } = usePassReasons()

  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState(applicants)
  const [updatedStatuses, setUpdatedStatuses] = useState<ApplicantStatusChanges>({})
  const { getAccessTokenSilently } = useAuth0()

  const [employers, setEmployers] = useState<{ id: string; name: string }[]>([])
  const [activeEmployer, setActiveEmployer] = useState<string | null>(null)

  const [token, setToken] = useState<string | null>(null)

  const [showPasses, setShowPasses] = useState<boolean>(false)

  const { onClose } = useDisclosure()

  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null)

  type ApplicantTable = {
    applicant: Applicant
    id: string
    name: string
    contactInfo: string
    job: string
    status: string
    appliedOn: string
  }

  const data: ApplicantTable[] = filteredApplicants.map((applicant) => {
    return {
      applicant,
      id: applicant.id,
      name: `${applicant.firstName} ${applicant.lastName}`,
      contactInfo: `${applicant.email} ${applicant.phoneNumber && `| ${applicant.phoneNumber}`}`,
      job: applicant.jobName,
      status: applicant.status,
      appliedOn: new Date(applicant.createdAt).toLocaleDateString(),
    }
  })

  const columnHelper = createColumnHelper<ApplicantTable>()

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
      cell: (info) => info.getValue(),
      header: 'Applied On',
    }),
  ]

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (!applicants) return
    if (!jobId) {
      setFilteredApplicants(applicants)
      return
    }

    setFilteredApplicants(applicants.filter((applicant) => applicant.jobId === jobId))
  }, [jobId, applicants])

  useEffect(() => {
    if (!applicants) return

    const us: ApplicantStatusChanges = {}

    applicants.forEach((a) => {
      us[a.id] = { status: a.status }
    })

    setUpdatedStatuses(us)
  }, [applicants])

  useEffect(() => {
    if (!employerJobs) return

    const groupedJobs = groupBy(employerJobs.jobs, ({ employerId }) => employerId)

    const employerArray = Object.keys(groupedJobs).map((key) => {
      return {
        id: key,
        name: groupedJobs[key][0].employerName,
      }
    })
    setEmployers(employerArray)

    if (!activeEmployer) {
      setActiveEmployer(employerArray[0].id)
    } else {
      const newJobs = employerJobs?.jobs.filter((job) => job.employerId === activeEmployer)
      const newApplicants = employerJobs?.applicants.filter((applicant) => {
        return newJobs?.find((job) => job.id === applicant.jobId)
      })

      if (newJobs) setJobs(newJobs)
      if (newApplicants) {
        if (showPasses) {
          setApplicants(newApplicants)
        } else {
          setApplicants(
            newApplicants.filter(
              (applicant) => applicant.status !== 'pass' && applicant.status !== 'hire',
            ),
          )
        }
      }
    }
  }, [employerJobs, showPasses])

  useEffect(() => {
    const newJobs = employerJobs?.jobs.filter((job) => job.employerId === activeEmployer)
    const newApplicants = employerJobs?.applicants.filter((applicant) => {
      return newJobs?.find((job) => job.id === applicant.jobId)
    })

    if (newJobs) setJobs(newJobs)
    if (newApplicants) {
      if (showPasses) {
        setApplicants(newApplicants)
      } else {
        setApplicants(
          newApplicants.filter(
            (applicant) => applicant.status !== 'pass' && applicant.status !== 'hire',
          ),
        )
      }
    }
  }, [activeEmployer, showPasses])

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

  const onTabChange = (index: number) => {
    if (!jobs) return

    if (index === 0) {
      router.push('/employers/jobs', undefined, { shallow: true })
    } else {
      router.push(`/employers/jobs/${jobs[index - 1].id}`, undefined, { shallow: true })
    }
  }

  if (isLoading) return <LoadingPage />

  const tabIndex = jobId && jobs ? jobs.indexOf(jobs.find((job) => job.id === jobId) as Job) + 1 : 0

  if (!activeEmployer) return <LoadingPage />

  return (
    <Flex py={'1.5rem'} px={'1rem'} flexDir={'column'} gap={'0.5rem'} width={'100%'}>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Applicants
        {employers.length > 1 && (
          <select onChange={(e) => setActiveEmployer(e.target.value)} value={activeEmployer}>
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
      <Tabs
        onChange={(index) => onTabChange(index)}
        index={tabIndex}
        variant="unstyled"
        colorScheme="gray"
        py={'12px'}
      >
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'gray.900', borderRadius: 4 }}>All</Tab>
          {jobs &&
            jobs.map((job, index) => {
              return (
                <Tab key={index} _selected={{ color: 'white', bg: 'gray.900', borderRadius: 4 }}>
                  {job.name}
                </Tab>
              )
            })}
        </TabList>
        <TabPanels></TabPanels>
      </Tabs>
      <Checkbox isChecked={showPasses} onChange={() => setShowPasses(!showPasses)}>
        Show Passes/Hires
      </Checkbox>
      <DataTable columns={columns} data={data} />
      <Drawer placement={'right'} isOpen={!!currentApplicant} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Give us Feedback</DrawerHeader>
          <DrawerBody>
            <Stack gap={'2rem'}>
              <Stack gap={'1rem'}>
                <p>
                  BlockTrain will notify {currentApplicant?.firstName} they are no longer being
                  considered for {currentApplicant?.jobName}
                </p>
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

export default withAuthenticationRequired(jobs)
