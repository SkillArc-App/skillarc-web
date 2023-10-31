import { Logo } from '@/frontend/icons/Logo.icon'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Image } from '@chakra-ui/react'
import {
  CareerPath,
  Employer,
  Job,
  JobPhoto,
  MasterCertification,
  MasterSkill,
  Testimonial,
} from '@prisma/client'
import { useState } from 'react'

type GetOneJobPosting = {
  employer: Employer
  learnedSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertificationId: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  testimonials: Testimonial[]
} & Job

export const JobPhotos = ({ data }: { data: GetOneJobPosting }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const handleRightClick = () => {
    if (data)
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1
        return newIndex < data.jobPhotos.length ? newIndex : 0
      })
  }
  const handleLeftClick = () => {
    if (data)
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex - 1
        return newIndex >= 0 ? newIndex : data.jobPhotos.length - 1
      })
  }
  if (data && data.jobPhotos && data.jobPhotos.length > 0) {
    return (
      <>
        <Image
          h="208px"
          w="100%"
          objectFit="cover"
          alt="photo"
          src={data?.jobPhotos[currentIndex].photo_url}
          zIndex={0}
          position="initial"
        />
        {data && data.jobPhotos && data.jobPhotos.length > 1 && (
          <Flex justifyContent="space-between" m="1rem" w="100%" zIndex={1} marginTop="-108px">
            <Box
              boxSize="26px"
              bg="white"
              borderRadius="900px"
              textAlign="center"
              cursor="pointer"
              onClick={handleLeftClick}
            >
              <ChevronLeftIcon boxSize="22px" verticalAlign="middle" />
            </Box>
            <Box
              boxSize="26px"
              bg="white"
              borderRadius="900px"
              textAlign="center"
              cursor="pointer"
              onClick={handleRightClick}
            >
              <ChevronRightIcon boxSize="22px" verticalAlign="middle" />
            </Box>
          </Flex>
        )}
      </>
    )
  } else {
    return (
      <Flex h="208px" w="100%" zIndex={0} position="initial" justifyContent="center">
        <Logo boxSize="16rem" />
      </Flex>
    )
  }
}
