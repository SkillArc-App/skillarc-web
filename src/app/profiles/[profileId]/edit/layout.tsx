'use client'

import { LoadingPage } from '@/app/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useRouter } from 'next/navigation'
import { useProfileData } from '../hooks/useProfileData'

export default function EditProfileLayout({ children }: { children: React.ReactNode }) {
  const { profileId } = useFixedParams('profileId')
  const { data: seeker } = useProfileData(profileId)

  if (!seeker || !seeker.isProfileEditor) {
    return <LoadingPage />
  }

  return children
}
