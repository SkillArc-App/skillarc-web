import { Marker } from '@/common/types/Marker'
import { Box, HStack, IconButton, Stack, Text } from '@chakra-ui/react'

interface NoteProps {
  marker: Marker
}

export const MarkerBox = ({ marker: { note, icon, date } }: NoteProps) => {
  const dateObj = new Date(date)

  return (
    <Box boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)" bg={'white'} py={'1rem'} px={'0.5rem'}>
      <Stack>
        <HStack justifyContent={'start'}>
          <IconButton aria-label="Communication Kind" icon={icon} />
          <Text>{note}</Text>
        </HStack>
        <Text variant={'b3'}>
          {`${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()} `}
        </Text>
      </Stack>
    </Box>
  )
}
