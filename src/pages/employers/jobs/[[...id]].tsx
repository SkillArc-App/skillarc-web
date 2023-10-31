'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useEmployerJobData } from '@/frontend/hooks/useEmployerJobData'
import { Applicant, Job } from '@/frontend/services/employerJobs.service'
import { useAuth0 } from '@auth0/auth0-react'
import {
  Button,
  Flex,
  Heading,
  Link,
  Select,
  Tab,
  TabList,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import axios from 'axios'
import { groupBy } from 'lodash'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function jobs() {
  const router = useRouter()
  const jobId: string | undefined = router.query.id?.at(0)

  const {
    getEmployerJobs: { data: employerJobs, refetch: refetchEmployerJobs, isLoading },
  } = useEmployerJobData()

  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState(applicants)
  const [updatedStatuses, setUpdatedStatuses] = useState<{ [key: string]: string }>({})
  const { getAccessTokenSilently } = useAuth0()

  const [employers, setEmployers] = useState<{ id: string; name: string }[]>([])
  const [activeEmployer, setActiveEmployer] = useState<string | null>(null)

  const [token, setToken] = useState<string | null>(null)

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

    const us: { [key: string]: string } = {}

    applicants.forEach((a) => {
      us[a.id] = a.status
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
      if (newApplicants) setApplicants(newApplicants)
    }
  }, [employerJobs])

  useEffect(() => {
    const newJobs = employerJobs?.jobs.filter((job) => job.employerId === activeEmployer)
    const newApplicants = employerJobs?.applicants.filter((applicant) => {
      return newJobs?.find((job) => job.id === applicant.jobId)
    })

    if (newJobs) setJobs(newJobs)
    if (newApplicants) setApplicants(newApplicants)
  }, [activeEmployer])

  const handleApplicantUpdate = async (id: string) => {
    const status = updatedStatuses[id]

    await axios.create({ withCredentials: false }).put(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/applicants/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    refetchEmployerJobs()
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
      <TableContainer bg="white">
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Contact Info</Th>
              <Th>Job</Th>
              <Th>Status</Th>
              <Th>Program(s)</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredApplicants &&
              filteredApplicants.map((applicant, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Link href={applicant.profileLink} as={NextLink}>
                        {applicant.firstName} {applicant.lastName}
                      </Link>
                    </Td>
                    <Td>
                      {applicant.email} {applicant.phoneNumber && `| ${applicant.phoneNumber}`}
                    </Td>
                    <Td>{applicant.jobName}</Td>
                    <Td>
                      <Select
                        onChange={(e) => {
                          setUpdatedStatuses({
                            ...updatedStatuses,
                            [applicant.id]: e.target.value,
                          })
                        }}
                        value={updatedStatuses[applicant.id]}
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
                    </Td>
                    <Td>{applicant.programs.join(', ')}</Td>
                    <Td>
                      <Button
                        colorScheme={
                          applicant.status === updatedStatuses[applicant.id] ? 'gray' : 'green'
                        }
                        onClick={
                          applicant.status === updatedStatuses[applicant.id]
                            ? () => {}
                            : () => handleApplicantUpdate(applicant.id)
                        }
                      >
                        Save
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}
