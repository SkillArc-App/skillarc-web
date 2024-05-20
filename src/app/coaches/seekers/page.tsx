'use client'

import { useCoachSeekersData } from '@/app/coaches/hooks/useCoachSeekersData'
import { CoachSeekerTable } from '@/app/coaches/types'
import DataTable from '@/frontend/components/DataTable.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Checkbox, HStack, Link, Stack, Tag } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const Coaches = () => {
  return (
    <Stack width={'100%'}>
      <Suspense>
        <Seekers />
      </Suspense>
    </Stack>
  )
}

const Seekers = () => {
  const { data } = useCoachSeekersData()
  const { data: user } = useUser()
  const router = useRouter()

  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  const filteredData =
    filter !== 'no' ? data?.filter((seeker) => seeker.assignedCoach == user?.email) : data

  return (
    <Stack width={'100%'}>
      <Checkbox
        isChecked={filter !== 'no'}
        onChange={() =>
          filter !== 'no'
            ? router.push('/coaches/seekers?filter=no')
            : router.push('/coaches/seekers?filter=yes')
        }
      >
        Owned by Me
      </Checkbox>
      {filteredData && <Table data={filteredData} />}
    </Stack>
  )
}

const Table = ({ data }: { data: CoachSeekerTable[] }) => {
  const columnHelper = createColumnHelper<CoachSeekerTable>()
  const lastActiveColumnId = 'last-active-on'

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Name',
      filterFn: (row, _, filterValue) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase()
        return fullName.includes(filterValue.toLowerCase())
      },
      cell: (row) => {
        const name = !!row.getValue()
          ? `${row.getValue()} ${row.row.original.lastName}`
          : 'Name not provided'

        return (
          <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
            {name}
          </Link>
        )
      },
    }),
    columnHelper.accessor('seekerId', {
      header: 'Navigation',
      cell: (row) => (
        <div>
          <Link as={NextLink} href={`/profiles/${row.row.original.seekerId}`}>
            Profile
          </Link>{' '}
          <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
            Dash
          </Link>
        </div>
      ),
    }),
    columnHelper.accessor('assignedCoach', {
      header: 'Coach',
      filterFn: 'includesString',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('certifiedBy', {
      header: 'Certified By',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('barriers', {
      header: 'Barriers',
      cell: (row) => (
        <HStack>
          {row.getValue().map((barrier, key) => (
            <Tag key={key}>{barrier.name}</Tag>
          ))}
        </HStack>
      ),
    }),
    columnHelper.accessor('lastActiveOn', {
      header: 'Last Active On',
      id: lastActiveColumnId,
      cell: (row) => {
        try {
          return new Date(row.getValue()).toDateString()
        } catch (e) {
          return row.getValue()
        }
      },
      sortUndefined: 1,
      sortDescFirst: false,
      sortingFn: (row1, row2, columnId) => {
        const date1 = new Date(row1.getValue(columnId))
        const date2 = new Date(row2.getValue(columnId))

        return date1.getTime() - date2.getTime()
      },
    }),
    columnHelper.accessor('lastContacted', {
      header: 'Last Contacted',
      cell: (row) => {
        return row.getValue() === 'Never' ? row.getValue() : new Date(row.getValue()).toDateString()
      },
      sortingFn: 'datetime',
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: true,
      id: lastActiveColumnId,
    },
  ]

  return <DataTable columns={columns} data={data} initialSortState={initialSortState} />
}

export default Coaches
