import { Box, Code, HStack, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAllUsers } from '../hooks/useAllUsers'
import { Text } from './Text.component'

const DevTools = () => {
  const mockAuth = process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH

  const { data: users } = useAllUsers()
  const queryClient = useQueryClient()

  const [selectValue, setSelectValue] = useState('')

  useEffect(() => {
    if (!users) return

    if (mockAuth && !localStorage.getItem('mockNextAuth')) {
      console.log('mock auth is set', users[0].sub)
      localStorage.setItem('mockNextAuth', users[0].sub)
      queryClient.invalidateQueries({ refetchActive: true })
    }
  }, [mockAuth, queryClient, users])

  useEffect(() => {
    if (selectValue === '') return

    localStorage.setItem('mockNextAuth', selectValue)
    queryClient.invalidateQueries({ refetchActive: true })
  }, [queryClient, selectValue])

  return (
    <>
      {process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH && (
        <HStack>
          <Box>
            <HStack>
              <Text type={'b2'} whiteSpace={'nowrap'}>
                mock auth:
              </Text>
              <Code color={mockAuth ? 'red' : 'green'}>{mockAuth}</Code>
            </HStack>
          </Box>
          <Select onChange={(e) => setSelectValue(e.target.value)} value={selectValue}>
            {(users || []).map((user) => {
              return (
                <option key={user.id} value={user.sub ?? ''}>
                  {user.email}
                </option>
              )
            })}
          </Select>
        </HStack>
      )}
    </>
  )
}

const NoopTools = () => (<></>)
const TestingTools = process.env.NODE_ENV === 'development'
  ? DevTools
  : NoopTools

export default TestingTools
