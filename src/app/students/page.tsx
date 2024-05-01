'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useStudentData } from '@/frontend/hooks/useStudentData'
import { put } from '@/frontend/http-common'
import RadioCardGroup from '@/app/students/components/RadioCardGroup'
import {
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
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
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

const valueFromStatus = (status: string) => {
  switch (status) {
    case 'not_enrolled':
      return 'Not Enrolled'
    case 'enrolled':
      return 'Enrolled'
    case 'graduated':
      return 'Graduated'
  }
}

export default function Students() {
  const {
    getStudents: { data, isLoading, refetch },
  } = useStudentData()

  const token = useAuthToken()

  const [activeProgram, setActiveProgram] = useState(0)
  const [programStudents, setProgramStudents] = useState(
    [] as {
      firstName: string
      lastName: string
      email: string
      profileId: string
      reference: {
        referenceText: string
        referenceId: string
      }
      status: string
      hiringStatus: string
    }[],
  )

  const changeActiveProgram = (index: number) => {
    if (data) {
      setActiveProgram(index)
      setProgramStudents(data[index].students)
    }
  }

  useEffect(() => {
    if (!isLoading && data) {
      setProgramStudents(data[activeProgram].students)
    }
  }, [activeProgram, data, isLoading])

  const changeProgramStatus = (
    programIndex: number,
    studentProfileId: string,
    statusValue: string,
  ) => {
    if (!data || !token) return

    const status = statusValue.toLowerCase().replace(' ', '_')

    const newProgramStudents = [...programStudents]
    const studentIndex = newProgramStudents.findIndex(
      (student) => student.profileId === studentProfileId,
    )
    newProgramStudents[studentIndex].status = status
    setProgramStudents(newProgramStudents)

    put(
      `/programs/${data[programIndex].programId}/students/${studentProfileId}`,
      {
        status: status,
      },
      token,
    ).then((res) => {
      refetch()
    })
  }

  if (!data || isLoading) {
    return <LoadingPage />
  } else
    return (
      <Flex py={'1.5rem'} px={'1rem'} flexDir={'column'} gap={'0.5rem'} width={'100%'}>
        <Heading color={'greyscale.900'} variant={'h2'}>
          Students
        </Heading>
        <Flex>
          <Tabs
            onChange={(index) => changeActiveProgram(index)}
            variant="unstyled"
            colorScheme="gray"
          >
            <TabList>
              {data &&
                data.map((program, index) => {
                  return (
                    <Tab
                      key={index}
                      _selected={{ color: 'white', bg: 'gray.900', borderRadius: 4 }}
                    >
                      {program.programName}
                    </Tab>
                  )
                })}
            </TabList>
            <TabPanels></TabPanels>
          </Tabs>
          <Spacer />
          <Link as={NextLink} href="students/invite">
            <Button backgroundColor={'white'} variant={'outline'}>
              Invite Students
            </Button>
          </Link>
        </Flex>
        <TableContainer bg="white">
          <Table variant={'simple'}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Program Status</Th>
                <Th>Hiring Status</Th>
                <Th>Reference</Th>
              </Tr>
            </Thead>
            <Tbody>
              {programStudents &&
                programStudents.map((student, index) => {
                  return (
                    <Tr key={index} color={'gray'}>
                      <Td>
                        {student.firstName} {student.lastName}
                      </Td>
                      <Td>
                        {student.hiringStatus !== 'No Profile' ? (
                          <RadioCardGroup
                            onChange={(value) => {
                              changeProgramStatus(activeProgram, student.profileId, value)
                            }}
                            value={valueFromStatus(student.status)}
                            defaultValue="Enrolled"
                            options={['Not Enrolled', 'Enrolled', 'Graduated']}
                          />
                        ) : (
                          <i>requires profile</i>
                        )}
                      </Td>
                      <Td>{student.hiringStatus}</Td>
                      <Td>
                        {student.hiringStatus !== 'No Profile' ? (
                          student.reference.referenceText ? (
                            <Button
                              as={Link}
                              href={`/reference/${student.reference.referenceId}/edit`}
                              color="white"
                              bg={'gray.900'}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              as={Link}
                              href={`/reference/new?seekerProfileId=${student.profileId}`}
                              color="white"
                              bg={'gray.900'}
                            >
                              + Add Reference
                            </Button>
                          )
                        ) : (
                          <i>requires profile</i>
                        )}
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
