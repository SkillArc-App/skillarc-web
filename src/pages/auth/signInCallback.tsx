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
      router.push('/')
    }
  }, [needsRedirect, router])

  // check if user exists in temp user table (old auth system)
  useEffect(() => {
    checkForTempUser()
    async function checkForTempUser() {
      if (user && user.email && user.id) {
        const existingUser = await FrontendTempUserService.getOne(user.email)
        if (existingUser) {
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
          const updatedUser = await FrontendUserService.updateUserWithTempData(
            updatingUserBody,
            user.id,
          )
          setNeedsRedirect(true)
        } else {
          setNeedsRedirect(true)
        }
      }
    }
  }, [user])

  return <LoadingPage />
}

export default AuthCallback
