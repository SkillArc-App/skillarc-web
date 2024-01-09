import { Students as InnerStudent } from '@/frontend/modules/students/components/Students.component'
import { useRouter } from 'next/router'

export default function Students() {
  const router = useRouter()

  return (
    <InnerStudent
      onAddReference={(seekerProfileId: string) => {
        router.push({ pathname: '/reference/new', query: { seekerProfileId } })
      }}
      onEditReference={(referenceId) => {
        router.push(`/reference/${referenceId}/edit`)
      }}
    />
  )
}
