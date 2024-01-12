import DataTable from '@/frontend/components/DataTable.component'
import { Heading } from '@/frontend/components/Heading.component'
import { CoachSeeker, useCoachSeekersData } from '@/frontend/hooks/useCoachSeekersData'
import { Box, HStack, Link, Tag } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'

const Coaches = () => {
  const { data } = useCoachSeekersData()

  return (
    <Box width={'100%'}>
      <Box px={'4rem'} pt={'1rem'}>
        <Heading>Seekers</Heading>
        <Box width={'100%'} pt={'2rem'}>
          {data && <Table data={data} />}
        </Box>
      </Box>
    </Box>
  )
}

const Table = ({ data }: { data: CoachSeeker[] }) => {
  const columnHelper = createColumnHelper<CoachSeeker>()

  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/s/${row.row.original.seekerId}`}>
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('seekerId', {
      header: 'Profile',
      cell: (row) => (
        <Link as={NextLink} href={`/profiles/${row.row.original.seekerId}`}>
          Jump to Profile
        </Link>
      ),
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('assignedCoach', {
      header: 'Assigned Coach',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('barriers', {
      header: 'Barriers',
      cell: (row) => (
        <HStack>
          {row.getValue().map((barrier, key) => (
            <Tag key={key}>{barrier}</Tag>
          ))}
        </HStack>
      ),
    }),
    columnHelper.accessor('lastContacted', {
      header: 'Last Contacted',
      cell: (row) => row.getValue(),
    })
  ]

  return <DataTable columns={columns} data={data} />
}

export default withAuthenticationRequired(Coaches)
