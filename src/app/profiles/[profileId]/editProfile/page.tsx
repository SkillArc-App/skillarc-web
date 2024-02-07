import { EditAbout } from '@/app/profiles/[profileId]/editProfile/components/editAbout'
import { EditCertifications } from '@/app/profiles/[profileId]/editProfile/components/editCertifications'
import { EditEducation } from '@/app/profiles/[profileId]/editProfile/components/editEducation'
import { EditExperience } from '@/app/profiles/[profileId]/editProfile/components/editExperience'
import { EditPersonalExperience } from '@/app/profiles/[profileId]/editProfile/components/editPersonalExperience'
import { EditReferences } from '@/app/profiles/[profileId]/editProfile/components/editReferences'
import { EditSkills } from '@/app/profiles/[profileId]/editProfile/components/editSkills'
import { EditSummary } from '@/app/profiles/[profileId]/editProfile/components/editSummary'
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
