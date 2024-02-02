import { SearchFilter, SearchOption, SearchValue } from '@/common/types/Search'
import { SearchIcon } from '@chakra-ui/icons'
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import Select, { MultiValue } from 'react-select'

type SelectSearchProps<T> = {
  label: string
  id: string
  options: readonly SearchOption<T>[]
  value: readonly SearchOption<T>[]
  onChange: (selection: MultiValue<SearchOption<T>>) => void
}

function SearchSelect<T>({ label, id, options, value, onChange }: SelectSearchProps<T>) {
  return (
    <FormControl width={'15rem'}>
      <FormLabel>{label}</FormLabel>
      <Select
        closeMenuOnSelect={false}
        id={id}
        isMulti
        classNamePrefix={id}
        options={options}
        placeholder={`${label}...`}
        value={value}
        onChange={onChange}
      />
    </FormControl>
  )
}

type SearchBarProps = {
  value: SearchValue
  filters?: SearchFilter[]
  onChange: (value: SearchValue) => void
}

const SearchBar = ({ value, filters = [], onChange }: SearchBarProps) => {
  return (
    <VStack width={'100%'} backgroundColor={'white'} align={'start'}>
      <InputGroup>
        {/* eslint-disable-next-line react/no-children-prop */}
        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
        <Input
          type="search"
          backgroundColor={'white'}
          placeholder="Search..."
          role="search"
          value={value.searchTerms}
          onChange={(e) => {
            onChange({
              ...value,
              searchTerms: e.target.value,
            })
          }}
        />
      </InputGroup>
      <HStack align={'start'} flexWrap={'wrap'} width={'100%'}>
        {filters.map(({ key, label, options }) => (
          <SearchSelect
            key={key}
            label={label}
            id={key}
            value={value.filters[key]}
            options={options}
            onChange={(filterValue) => {
              onChange({
                ...value,
                filters: {
                  ...value.filters,
                  [key]: filterValue.map((x) => x),
                },
              })
            }}
          />
        ))}
      </HStack>
    </VStack>
  )
}

export default SearchBar
