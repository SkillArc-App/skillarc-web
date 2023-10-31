import { User } from '@/common/types/User'
import { LoadingPage } from '@/frontend/components/Loading'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendTempUserService } from '@/frontend/services/tempUser.service'
import { FrontendUserService } from '@/frontend/services/user.service'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const AuthCallback = () => {
  const router = useRouter()
  const { data: user } = useUser()
  const [needsRedirect, setNeedsRedirect] = useState(false)

  // handle redirect
  useEffect(() => {
    if (needsRedirect) {
      console.log('redirecting')
      router.push('/')
    }
  }, [needsRedirect])

  // check if user exists in temp user table (old auth system)
  useEffect(() => {
    checkForTempUser()
    async function checkForTempUser() {
      if (user && user.email && user.id) {
        console.log('within the if')
        const existingUser = await FrontendTempUserService.getOne(user.email)
        if (existingUser) {
          console.log('existing user', existingUser)
          let updatingUserBody: Partial<User> = {}
          if (existingUser.name) {
            updatingUserBody.name = existingUser.name
          }
          if (existingUser.image) {
            updatingUserBody.image = existingUser.image
          }
          if (existingUser.firstName) {
            updatingUserBody.firstName = existingUser.firstName
          }
          if (existingUser.lastName) {
            updatingUserBody.lastName = existingUser.lastName
          }
          if (existingUser.zipCode) {
            updatingUserBody.zipCode = existingUser.zipCode
          }
          if (existingUser.phoneNumber) {
            updatingUserBody.phoneNumber = existingUser.phoneNumber
          }
          console.log('updating user body', updatingUserBody)
          const updatedUser = await FrontendUserService.updateUserWithTempData(
            updatingUserBody,
            user.id,
          )
          console.log('updated user', updatedUser)
          setNeedsRedirect(true)
        } else {
          console.log('no user in temp user table')
          setNeedsRedirect(true)
        }
      } else {
        console.log('no user or email or id')
      }
    }
  }, [user])

  return <LoadingPage />
}

export default AuthCallback
