'use client'

import { Maybe } from '@/common/types/maybe'
import { Box, Code, HStack, Select } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAllUsers } from '../hooks/useAllUsers'
import { Text } from './Text.component'

const DevTools = () => {
  const mockAuth = process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH === 'true'

  const { data: users } = useAllUsers()
  const queryClient = useQueryClient()
  const [sub, setSub] = useState<Maybe<string>>(undefined)

  const setUserSub = useCallback(
    (sub: string) => {
      setSub(sub)
      localStorage.setItem('mockNextAuth', sub)
      queryClient.invalidateQueries({ refetchActive: true })
    },
    [queryClient],
  )

  useEffect(() => {
    if (!mockAuth) {
      return
    }
    if (!users) {
      return
    }

    const storageSub = localStorage?.getItem('mockNextAuth')
    if (storageSub) {
      setUserSub(storageSub)
    } else {
      setUserSub(users[0].sub)
    }
  }, [mockAuth, setUserSub, users])

  if (!mockAuth) {
    return <></>
  }

  return (
    <HStack>
      <Box>
        <HStack>
          <Text type={'b2'} whiteSpace={'nowrap'}>
            mock auth:
          </Text>
          <Code color={'red'}>{'true'}</Code>
        </HStack>
      </Box>
      <Select onChange={(e) => setUserSub(e.target.value)} value={sub}>
        {(users ?? []).map((user) => (
          <option key={user.id} value={user.sub}>
            {user.email}
          </option>
        ))}
      </Select>
    </HStack>
  )
}

const NoopTools = () => <></>
const TestingTools = process.env.NODE_ENV === 'development' ? DevTools : NoopTools

export default TestingTools
