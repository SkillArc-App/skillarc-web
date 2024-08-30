import { HStack, Input, InputGroup, VStack } from '@chakra-ui/react'

const SearchBarLoading = () => {
  return (
    <VStack width={'100%'} align={'start'}>
      <InputGroup>
        <Input
          type="search"
          backgroundColor={'white'}
          placeholder="Job Title, Role ..."
          role="search"
        />
      </InputGroup>
      <HStack align={'start'} flexWrap={'wrap'} width={'100%'}></HStack>
    </VStack>
  )
}

export default SearchBarLoading
