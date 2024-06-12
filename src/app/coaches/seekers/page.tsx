'use client'

import { CoachSeekerTable } from '@/app/coaches/types'
import SearchBar from '@/app/jobs/components/SearchBar'
import { usePersonSearch } from '@/app/jobs/hooks/usePersonSearch'
import { Attribute } from '@/common/types/Attribute'
import { PersonSearchValue } from '@/common/types/PersonSearch'
import { SearchValue } from '@/common/types/Search'
import DataTable from '@/frontend/components/DataTable.component'
import { useDebounce } from '@/frontend/hooks/useDebounce'
import { useUser } from '@/frontend/hooks/useUser'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  HStack,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import { useCoachAttributes } from '../hooks/useCoachAttributes'

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

  const router = useRouter()

  const searchParams = useSearchParams()
  const searchTerms = searchParams?.get('utm_term') ?? searchParams?.get('searchTerm') ?? ''
  const filter = searchParams.get('filter')

  const [searchValue, setSearchValue] = useState<PersonSearchValue>({
    searchTerms,
    attributeFilters: {},
  })

  const debouncedSearchValue = useDebounce(searchValue, 500)

  const { data } = usePersonSearch(debouncedSearchValue)
  // const data: any[] = []

  // const searchValue: SearchValue = {
  //   searchTerms: term,
  //   filters: {},
  //   otherUtmParams: {},
  // }

  const [selectedAttributes, setSelectedAttributes] = useState<{ [name: string]: string[] }>({})

  useEffect(() => {
    if (!attributes) return

    const newSelectedAttributes: { [key: string]: string[] } = {}
    attributes?.forEach((attribute) => {
      const attrName = `attr_${attribute.name}`
      const attrValues = searchParams.getAll(attrName)
      newSelectedAttributes[attribute.name] = attrValues
    })

    setSelectedAttributes(newSelectedAttributes)
  }, [attributes])

  const filteredData =
    filter !== 'no' ? data?.filter((seeker) => seeker.assignedCoach == user?.email) : data

  const onSearchChange = (value: PersonSearchValue) => {
    const filterString = filter !== 'no' ? 'filter=yes' : 'filter=no'
    const attrString = Object.entries(value.attributeFilters)
      .map(([name, values]) => {
        const attrName = `attr_${name}`

        return values.map((value) => `${attrName}=${value}`)
      })
      .flat()
      .join('&')

    router.replace(`/coaches/seekers?utm_term=${value.searchTerms}&${filterString}&${attrString}`)
    setSearchValue(value)
  }

  const onAttributeChange = (attributeName: string, values: string[]) => {
    const filterString = filter !== 'no' ? 'filter=yes' : 'filter=no'

    const newSelectedAttributes = { ...selectedAttributes, [attributeName]: values }
    setSelectedAttributes(newSelectedAttributes)

    const attrString = Object.entries(newSelectedAttributes)
      .map(([name, values]) => {
        const attrName = `attr_${name}`

        return values.map((value) => `${attrName}=${value}`)
      })
      .flat()
      .join('&')

    router.replace(
      `/coaches/seekers?utm_term=${searchValue.searchTerms}&${filterString}&${attrString}`,
    )

    setSearchValue({ ...searchValue, attributeFilters: newSelectedAttributes })
  }

  return (
    <Stack width={'100%'}>
      <Checkbox
        isChecked={filter !== 'no'}
        onChange={() => {
          const filterString = filter !== 'no' ? 'filter=no' : 'filter=yes'
          router.replace(`/coaches/seekers?utm_term=${searchValue.searchTerms}&${filterString}`)
        }}
      >
        Owned by Me
      </Checkbox>
      <SearchBar
        value={{ searchTerms: searchValue.searchTerms, filters: {}, otherUtmParams: {} }}
        onChange={(sv: SearchValue) =>
          onSearchChange({ searchTerms: sv.searchTerms, attributeFilters: selectedAttributes })
        }
      />
      <HStack>
        {attributes?.map((attribute) => (
          <AttributePopover
            key={attribute.id}
            isDifferent={selectedAttributes[attribute.name]?.length > 0}
            selectedValue={selectedAttributes[attribute.name] ?? []}
            baseAttribute={attribute}
            onChange={(e) => onAttributeChange(attribute.name, e)}
            reset={() => onAttributeChange(attribute.name, [])}
          />
        ))}
      </HStack>
      {filteredData && <Table data={filteredData} />}
    </Stack>
  )
}

const AttributePopover = ({
  baseAttribute,
  isDifferent,
  selectedValue,
  onChange,
  reset,
}: {
  baseAttribute: Attribute
  isDifferent: boolean
  selectedValue: string[]
  onChange: (value: string[]) => void
  reset: () => void
}) => {
  const colorScheme = isDifferent ? 'blue' : 'gray'

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme={colorScheme} size={'xs'} rightIcon={<FaChevronDown />}>
          {baseAttribute.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <CheckboxGroup onChange={onChange} value={selectedValue}>
            <Stack>
              {baseAttribute.set.map((value) => (
                <Checkbox value={value} key={value}>
                  {value}
                </Checkbox>
              ))}

              <Button size={'xs'} onClick={reset}>
                Reset
              </Button>
            </Stack>
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
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
