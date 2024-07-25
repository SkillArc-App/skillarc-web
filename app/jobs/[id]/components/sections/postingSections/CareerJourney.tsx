import { Flex } from '@chakra-ui/react'
import { Job } from 'app/common/types/Job'
import { Heading } from 'app/components/Heading'
import { Text } from 'app/components/Text.component'
import { formatCurrency } from 'app/helpers/formatCurrency.helper'
import { NeonCircleIcon } from 'app/icons/NeonCircle'

export const CareerJourney = ({ job }: { job: Job }) => {
  const header = job.careerPaths.length === 1 ? '🧗 Wages' : '🧗 Your career journey'

  return (
    <Flex
      bg="white"
      w="100%"
      p="1rem"
      borderRadius=".25rem"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      flexWrap="wrap"
    >
      <Heading type="h4" color="greyscale.700" w="100%" marginBottom="1rem">
        {header}
      </Heading>
      {job.careerPaths
        .sort((a, b) => a.order - b.order)
        .map((careerPath, index) => {
          return (
            <Flex w="100%" flexWrap="wrap" key={index}>
              <NeonCircleIcon boxSize="16px" zIndex={2} />
              <Flex
                flexWrap="wrap"
                gap=".25rem"
                borderLeft={index == job.careerPaths.length - 1 ? 'none' : '1px dashed #CED4DA'}
                marginLeft="-8px"
                paddingLeft="1rem"
              >
                <Text type="b2Bold" color="greyscale.900" w="100%">
                  {careerPath.title}
                </Text>
                <Text type="b2" color="greyscale.600" w="100%" marginBottom="1rem">
                  {formatCurrency(careerPath.lowerLimit)} - {formatCurrency(careerPath.upperLimit)}
                </Text>
              </Flex>
            </Flex>
          )
        })}
    </Flex>
  )
}
