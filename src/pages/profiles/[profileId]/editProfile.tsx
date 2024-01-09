import { EditAbout } from '@/frontend/modules/editProfile/components/editAbout.component'
import { EditCertifications } from '@/frontend/modules/editProfile/components/editCertifications.component'
import { EditEducation } from '@/frontend/modules/editProfile/components/editEducation.component'
import { EditExperience } from '@/frontend/modules/editProfile/components/editExperience.component'
import { EditPersonalExperience } from '@/frontend/modules/editProfile/components/editPersonalExperience'
import { EditReferences } from '@/frontend/modules/editProfile/components/editReferences.component'
import { EditSkills } from '@/frontend/modules/editProfile/components/editSkills.component'
import { EditSummary } from '@/frontend/modules/editProfile/components/editSummary.component'
import { useRouter } from 'next/router'

export default function EditProfile() {
  const router = useRouter()
  const { section } = router.query
  switch (section) {
    case 'summary':
      return <EditSummary />
    case 'about':
      return <EditAbout />
    case 'skills':
      return <EditSkills />
    case 'certifications':
      return <EditCertifications />
    case 'experience':
      return <EditExperience />
    case 'personalExperience':
      return <EditPersonalExperience />
    case 'education':
      return <EditEducation />
    case 'references':
      return <EditReferences />
  }
}
