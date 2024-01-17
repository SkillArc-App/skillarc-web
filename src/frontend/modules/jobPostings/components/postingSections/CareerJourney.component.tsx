import { Heading } from '@/frontend/components/Heading.component'
import { formatCurrency } from '@/frontend/helpers/formatCurrency.helper'
import { NeonCircleIcon } from '@/frontend/icons/NeonCircle.icon'
import { CareerPath, GetOneJobPosting } from '@/frontend/services/jobs.service'
import { Flex } from '@chakra-ui/react'
import { Text } from '../../../../components/Text.component'

export const CareerJourney = ({ data }: { data: GetOneJobPosting }) => {
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
        🧗 Your career journey
      </Heading>
      {data &&
        data.careerPaths &&
        sortByOrder(data?.careerPaths).map((careerPath, index) => {
          return (
            <Flex w="100%" flexWrap="wrap" key={index}>
              <NeonCircleIcon boxSize="16px" zIndex={2} />
              <Flex
                flexWrap="wrap"
                gap=".25rem"
                borderLeft={index == data.careerPaths.length - 1 ? 'none' : '1px dashed #CED4DA'}
                marginLeft="-8px"
                paddingLeft="1rem"
              >
                <Text type="b2Bold" color="greyscale.900" w="100%">
                  {careerPath.title}
                </Text>
                <Text type="b2" color="greyscale.600" w="100%" marginBottom="1rem">
                  {formatCurrency(careerPath.lower_limit)} -{' '}
                  {formatCurrency(careerPath.upper_limit)}
                </Text>
              </Flex>
            </Flex>
          )
        })}
    </Flex>
  )
}

function sortByOrder(arr: CareerPath[]) {
  arr.sort(function (a, b) {
    return a.order - b.order
  })
  return arr
}
