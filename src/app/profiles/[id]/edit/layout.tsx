'use client'

import { LoadingPage } from '@/app/components/Loading'
import { IdParams } from '@/common/types/PageParams'
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
