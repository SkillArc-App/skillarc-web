"use client"

import { LoadingPage } from '@/frontend/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { useRouter } from 'next/navigation'

export default function EditProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profileId } = useFixedParams('profileId')
  const { data: seeker } = useProfileData(profileId)

  if (!seeker || !seeker.isProfileEditor) {
    return <LoadingPage />
  }

  return children
}
