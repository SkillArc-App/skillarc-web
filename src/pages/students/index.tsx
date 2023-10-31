import { Students } from '@/frontend/modules/students/components/Students.component'
import { useRouter } from 'next/router'

export default function students() {
  const router = useRouter()

  return (
    <Students
      onAddReference={(seekerProfileId: string) => {
        router.push({ pathname: '/reference/new', query: { seekerProfileId } })
      }}
      onEditReference={(referenceId) => {
        router.push(`/reference/${referenceId}/edit`)
      }}
    />
  )
}
