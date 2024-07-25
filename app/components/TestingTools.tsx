'use client'

import { FormControl, FormLabel, HStack, Select } from '@chakra-ui/react'
import { Maybe } from 'app/common/types/maybe'
import { useCallback, useEffect, useState } from 'react'
import { useAllUsers } from '../admin/hooks/useAllUsers'

const DevTools = () => {
  const { data: users } = useAllUsers()
  const [sub, setSub] = useState<Maybe<string>>(undefined)

  const setUserSub = useCallback(
    (sub: string) => {
      setSub(sub)
      localStorage.setItem('mockNextAuth', sub)
    },
    [setSub],
  )

  useEffect(() => {
    if (!users) {
      return
    }

    const storageSub = localStorage?.getItem('mockNextAuth')
    if (storageSub) {
      setUserSub(storageSub)
    } else {
      setUserSub(users[0].sub)
    }
  }, [setUserSub, users])

  return (
    <FormControl width={'400px'}>
      <HStack alignItems={'center'}>
        <FormLabel marginBottom={'0px'} whiteSpace={'nowrap'}>
          Mock Auth Enabled
        </FormLabel>
        <Select onChange={(e) => setUserSub(e.target.value)} value={sub}>
          {(users ?? []).map((user) => (
            <option key={user.id} value={user.sub}>
              {user.email}
            </option>
          ))}
        </Select>
      </HStack>
    </FormControl>
  )
}

const NoopTools = () => <></>
const TestingTools =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH === 'true'
      ? DevTools
      : NoopTools
    : NoopTools

export default TestingTools
