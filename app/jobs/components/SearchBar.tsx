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
import Select, { MultiValue, StylesConfig } from 'react-select'

type SelectSearchProps<T> = {
  label: string
  id: string
  options: readonly SearchOption<T>[]
  value: readonly SearchOption<T>[]
  onChange: (selection: MultiValue<SearchOption<T>>) => void
}

function SearchSelect<T>({ label, id, options, value, onChange }: SelectSearchProps<T>) {
  const styles: StylesConfig<SearchOption<T>> = {
    control: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size of the input text
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size of the placeholder text
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size of the selected value
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size of the dropdown options
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '12px', // Adjust the font size of the options
    }),
  }

  return (
    <FormControl width={'15rem'}>
      <FormLabel fontSize={'small'} htmlFor={id}>
        {label}
      </FormLabel>
      <Select
        closeMenuOnSelect={false}
        inputId={id}
        isMulti
        classNamePrefix={id}
        options={options}
        placeholder={`${label}...`}
        value={value}
        onChange={onChange}
        styles={styles}
      />
    </FormControl>
  )
}

type SearchBarProps<T> = {
  value: SearchValue<T>
  placeholder?: string
  filters?: SearchFilter<T>[]
  onChange: (value: SearchValue<T>) => void
}

export default function SearchBar<T>({
  value,
  placeholder = 'Search...',
  filters = [],
  onChange,
}: SearchBarProps<T>) {
  return (
    <VStack width={'100%'} align={'start'}>
      <InputGroup>
        {/* eslint-disable-next-line react/no-children-prop */}
        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
        <Input
          type="search"
          backgroundColor={'white'}
          placeholder={placeholder}
          role="search"
          value={value.searchTerms}
          onChange={(e) => {
            onChange({
              filters: value.filters,
              otherUtmParams: {},
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
                otherUtmParams: {},
                searchTerms: value.searchTerms,
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
