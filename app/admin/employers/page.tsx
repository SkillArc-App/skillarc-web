'use client'

import { useAllEmployers } from '@/admin/hooks/useAllEmployerData'
import { LoadingPage } from '@/components/Loading'
import { useAuthToken } from '@/hooks/useAuthToken'
import { post } from '@/http-common'
import {
  Box,
  Button,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { EmployerBasics, EmployerModal } from './components/EmployerModal'

export default function Employers() {
  const { data: employers, refetch } = useAllEmployers()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const token = useAuthToken()

  const onSubmit = async (employer: Partial<EmployerBasics>) => {
    if (!token) {
      return
    }

    await post(`/employers`, employer, token)
    refetch()
    onClose()
  }

  if (!employers) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Employer
      </Button>
      <TableContainer>
        <Table size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Logo URL</Th>
              <Th>Bio</Th>
              <Th>Location</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employers.map((employer, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link href={`/admin/employers/${employer.id}`} as={NextLink}>
                      {employer.name}
                    </Link>
                  </Td>
                  <Td>
                    <Link href={employer.logoUrl ?? ''} as={NextLink}>
                      link
                    </Link>
                  </Td>
                  <Td whiteSpace={'normal'}>{employer.bio}</Td>
                  <Td>{employer.location}</Td>
                  <Td>{new Date(employer.createdAt).toDateString()}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <EmployerModal
        isOpen={isOpen}
        title="New Employer"
        onClose={onClose}
        onSubmit={onSubmit}
        initialValue={{}}
      />
    </Box>
  )
}
