'use client'

import { IdParams } from 'app/common/types/PageParams'
import { LoadingPage } from 'app/components/Loading'
import { useProfileData } from '../hooks/useProfileData'

export default function EditProfileLayout({
  children,
  params: { id },
}: { children: React.ReactNode } & IdParams) {
  const { data: seeker } = useProfileData(id)

  if (!seeker || !seeker.isProfileEditor) {
    return <LoadingPage />
  }

  return children
}
