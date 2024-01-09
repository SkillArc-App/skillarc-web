import { useStudentData } from '@/frontend/hooks/useStudentData'
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
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import RadioCardGroup from '../../onBoarding/components/RadioCardGroup.component'

// add student prop interface with an onAddReference function
// add reference prop interface with an onEditReference function
interface StudentProps {
  onAddReference: (seekerProfileId: string) => void
  onEditReference: (referenceId: string) => void
}

export const Students = ({ onAddReference, onEditReference }: StudentProps) => {
  const {
    getStudents: { data, isLoading, refetch },
  } = useStudentData()

  const [token, setToken] = useState<string | null>(null)

  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

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
    if (!data) return

    const status = statusValue.toLowerCase().replace(' ', '_')

    const newProgramStudents = [...programStudents]
    const studentIndex = newProgramStudents.findIndex(
      (student) => student.profileId === studentProfileId,
    )
    newProgramStudents[studentIndex].status = status
    setProgramStudents(newProgramStudents)

    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/programs/${data[programIndex].programId}/students/${studentProfileId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        refetch()
      })
  }

  if (!data || isLoading) {
    return <></>
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
                              onClick={() => onEditReference(student.reference.referenceId)}
                              color="white"
                              bg={'gray.900'}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                onAddReference(student.profileId)
                              }}
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
