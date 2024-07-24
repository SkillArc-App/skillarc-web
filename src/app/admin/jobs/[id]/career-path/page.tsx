'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { CareerPath } from '@/common/types/Job'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { destroy, post, put } from '@/frontend/http-common'
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useState } from 'react'

const CareerPathPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const token = useAuthToken()

  const [careerPathTitle, setCareerPathTitle] = useState('')
  const [careerPathLowerLimit, setCareerPathLowerLimit] = useState('')
  const [careerPathUpperLimit, setCareerPathUpperLimit] = useState('')

  const createPath = async () => {
    if (!token) return

    await post(
      `/jobs/${id}/career_paths`,
      {
        job_id: id,
        title: careerPathTitle,
        lower_limit: careerPathLowerLimit,
        upper_limit: careerPathUpperLimit,
      },
      token,
    )

    setCareerPathTitle('')
    setCareerPathLowerLimit('')
    setCareerPathUpperLimit('')
    refetchJob()
  }

  const movePathUp = async (path: CareerPath) => {
    if (!token) return

    await put(`/jobs/${id}/career_paths/${path.id}/up`, {}, token)

    refetchJob()
  }

  const movePathDown = async (path: CareerPath) => {
    if (!token) return

    await put(`/jobs/${id}/career_paths/${path.id}/down`, {}, token)

    refetchJob()
  }

  const removePath = async (path: CareerPath) => {
    if (!token) return

    await destroy(`/jobs/${id}/career_paths/${path.id}`, token)

    refetchJob()
  }

  if (!job) return <></>

  return (
    <Flex gap={'1rem'}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Title</Th>
              <Th>Lower limit</Th>
              <Th>Upper limit</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {job.careerPaths
              .sort((a, b) => a.order - b.order)
              .map((cp, index: number) => {
                return (
                  <Tr key={index}>
                    <Td>{cp.order}</Td>
                    <Td>{cp.title}</Td>
                    <Td>{cp.lowerLimit}</Td>
                    <Td>{cp.upperLimit}</Td>
                    <Td>
                      <HStack>
                        <Button onClick={() => movePathUp(cp)} size={'xs'}>
                          <ArrowUpIcon />
                        </Button>
                        <Button onClick={() => movePathDown(cp)} size={'xs'}>
                          <ArrowDownIcon />
                        </Button>
                        <Button onClick={() => removePath(cp)} size={'xs'}>
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </TableContainer>
      <Stack gap={'1rem'}>
        <Input
          placeholder="Title"
          value={careerPathTitle}
          onChange={(e) => setCareerPathTitle(e.target.value)}
        />
        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            placeholder="Lower limit"
            value={careerPathLowerLimit}
            onChange={(e) => setCareerPathLowerLimit(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            placeholder="Upper limit"
            value={careerPathUpperLimit}
            onChange={(e) => setCareerPathUpperLimit(e.target.value)}
          />
        </InputGroup>
        <Flex>
          <Button onClick={createPath} colorScheme={'green'}>
            Create
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default CareerPathPage
