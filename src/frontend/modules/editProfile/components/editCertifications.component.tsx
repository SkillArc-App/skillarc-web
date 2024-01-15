import { Heading } from '@/frontend/components/Heading.component'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Checkbox, Flex } from '@chakra-ui/react'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateMyProfile } from '../hooks/useUpdateProfile'

type MasterCertification = {
  id: string
  certification: string
  created_at: Date
  updated_at: Date
}

export const EditCertifications = () => {
  //    hooks invocations
  const { data: user } = useUser()
  const { masterCertificationQuery } = useMasterCertificationData()
  const {
    addProfileCertification: { mutate: addProfileCertification },
    deleteProfileCertification: { mutate: deleteProfileCertification },
  } = useUpdateMyProfile()
  //   state declarations
  const [selectedMasterSkills, setSelectedMasterSkills] = useState<MasterCertification[]>([])

  //   handlers
  const handleSelectCertifications = (cert: MasterCertification, isChecked: boolean) => {
    // If the certification is checked, add it to selectedMasterSkills
    if (isChecked) {
      setSelectedMasterSkills((prevSelected) => [...prevSelected, cert])
    } else {
      // If the certification is unchecked, remove it from selectedMasterSkills
      setSelectedMasterSkills((prevSelected) =>
        prevSelected.filter((selectedCertification) => selectedCertification.id !== cert.id),
      )
    }
  }
  const handleSaveCertifications = () => {
    if (
      user &&
      user.profile &&
      masterCertificationQuery.data &&
      user.profile.profileCertifications
    ) {
      const existingCertifications = user.profile.profileCertifications.map(
        (profileCert: { masterCertification: { id: string } }) =>
          profileCert.masterCertification.id,
      )

      const newCertifications = selectedMasterSkills.filter(
        (cert: { id: string }) => !existingCertifications.includes(cert.id),
      )

      const removedCertifications = existingCertifications.filter(
        (certId: string) => !selectedMasterSkills.some((cert) => cert.id === certId),
      )

      // Add new certifications
      newCertifications.forEach((cert) => {
        addProfileCertification({
          profileCertification: {
            master_certification_id: cert.id,
          },
          profileId: user?.profile?.id ?? '',
        })
      })

      // Remove existing certifications
      removedCertifications.forEach((certId: string) => {
        const profileCertification = user?.profile?.profileCertifications?.find(
          (profileCert: { masterCertification: { id: string } }) =>
            profileCert.masterCertification.id === certId,
        )
        if (profileCertification) {
          deleteProfileCertification({
            profileCertificationId: profileCertification.id,
            profileId: user?.profile?.id ?? '',
          })
        }
      })
    }
    router.back()
  }

  useEffect(() => {
    if (
      user &&
      user.profile &&
      user.profile.profileCertifications &&
      masterCertificationQuery.data
    ) {
      // Map through profileCertifications and extract masterCertification property
      const res = user.profile.profileCertifications.map(
        (cert: { masterCertification: MasterCertification }) => {
          return cert.masterCertification
        },
      )

      setSelectedMasterSkills(res)
    }
  }, [user, masterCertificationQuery.data])

  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit Certifications</Heading>
      <Flex mt={'0.5rem'} flexDir={'column'} gap={'1rem'}>
        <>
          {masterCertificationQuery.data &&
            masterCertificationQuery.data.map((cert, index) => {
              // Check if the certification exists in the selectedMasterSkills list
              const isChecked = selectedMasterSkills.some(
                (selectedCertification) =>
                  selectedCertification.certification === cert.certification,
              )
              return (
                <Checkbox
                  variant={'box'}
                  onChange={(e) => handleSelectCertifications(cert, e.target.checked)}
                  isChecked={isChecked}
                  value={cert.certification}
                  key={index}
                  bg={'white'}
                  border="none"
                  boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.05)"
                >
                  {cert.certification}
                </Checkbox>
              )
            })}
        </>
      </Flex>
      <Button variant="primary" w="100%" onClick={handleSaveCertifications}>
        Save Changes
      </Button>
    </Flex>
  )
}
