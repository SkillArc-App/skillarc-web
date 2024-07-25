import { Job } from '@/common/types/Job'
import { Logo } from '@/icons/Logo'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useState } from 'react'

export const JobPhotos = ({ job }: { job: Job }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      return newIndex < job.jobPhotos.length ? newIndex : 0
    })
  }
  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      return newIndex >= 0 ? newIndex : job.jobPhotos.length - 1
    })
  }

  if (job.jobPhotos.length === 0) {
    return (
      <Flex h="208px" w="100%" zIndex={0} position="initial" justifyContent="center">
        <Logo boxSize="16rem" />
      </Flex>
    )
  }

  return (
    <>
      <Image
        h="300px"
        w="100%"
        fit="cover"
        alt="photo"
        src={job?.jobPhotos[currentIndex].photoUrl}
        zIndex={0}
        position="initial"
      />
      {job.jobPhotos.length > 1 && (
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
}
