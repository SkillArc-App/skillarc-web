'use client'

import { CoachSeekerTable, SubmittableSeekerLead } from '@/coaches/types'
import { SearchValue } from '@/common/types/Search'
import DataTable from '@/components/DataTable'
import { useAuthToken } from '@/hooks/useAuthToken'
import { useDebounce } from '@/hooks/useDebounce'
import { useUser } from '@/hooks/useUser'
import { post } from '@/http-common'
import SearchBar from '@/jobs/components/SearchBar'
import { usePersonSearch } from '@/jobs/hooks/usePersonSearch'
import { Button, Checkbox, HStack, Link, Spacer, Stack, useDisclosure } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useCoachAttributes } from '../hooks/useCoachAttributes'
import NewLeadModal from './components/NewLeadModal'

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
  const { data: user } = useUser()
  const { data: attributes } = useCoachAttributes()
  const { isOpen, onOpen, onClose } = useDisclosure({})
  const token = useAuthToken()

  const router = useRouter()

  const searchParams = useSearchParams()
  const searchTerms = searchParams?.get('utm_term') ?? searchParams?.get('searchTerm') ?? ''
  const filter = searchParams.get('filter')

  const [searchValue, setSearchValue] = useState<SearchValue>({
    searchTerms,
    filters: {},
    otherUtmParams: {},
  })

  const debouncedSearchValue = useDebounce(searchValue, 500)
  console.log(debouncedSearchValue)

  const { data, refetch } = usePersonSearch(debouncedSearchValue)
  const filters = (attributes ?? []).map((attribute) => ({
    key: attribute.id,
    label: attribute.name,
    options: attribute.set.map((i) => ({
      value: i,
      label: i[0].toLocaleUpperCase() + i.slice(1),
    })),
  }))

  const filteredData =
    filter !== 'no' ? data?.filter((seeker) => seeker.assignedCoach == user?.email) : data

  const handleSubmit = (lead: SubmittableSeekerLead) => {
    if (!token) return

    post(`/coaches/leads/`, { lead }, token).then(() => {
      refetch()

      onClose()
    })
  }

  const onSearchChange = (value: SearchValue) => {
    const filterString = filter !== 'no' ? 'filter=yes' : 'filter=no'
    const attrString = Object.entries(value.filters)
      .map(([name, values]) => {
        return values.map(({ value }) => `${name}=${value}`)
      })
      .flat()
      .join('&')

    router.replace(`/coaches/seekers?utm_term=${value.searchTerms}&${filterString}&${attrString}`)
    setSearchValue(value)
  }

  return (
    <Stack width={'100%'}>
      <NewLeadModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
      <HStack>
        <Checkbox
          isChecked={filter !== 'no'}
          onChange={() => {
            const filterString = filter !== 'no' ? 'filter=no' : 'filter=yes'
            router.replace(`/coaches/seekers?utm_term=${searchValue.searchTerms}&${filterString}`)
          }}
        >
          Owned by Me
        </Checkbox>
        <Spacer />
        <Button onClick={onOpen} colorScheme="green">
          New Lead
        </Button>
      </HStack>

      <SearchBar value={searchValue} filters={filters} onChange={onSearchChange} />
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
    columnHelper.accessor('kind', {
      header: 'Kind',
      cell: (row) => row.getValue(),
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
