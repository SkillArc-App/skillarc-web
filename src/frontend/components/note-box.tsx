import { DeleteIcon } from "@chakra-ui/icons"
import { Box, IconButton, Text } from "@chakra-ui/react"

interface NoteProps {
  note: string
  noteId: string
  onDeleteClicked(id: string): void
}

export const NoteBox = ({ note, noteId, onDeleteClicked }: NoteProps) => {
  return (
    <Box boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)" bg={'white'} py={'1rem'} px={'0.5rem'}>
      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} flexDir="row">
        <Text variant={'b2'}>{note}</Text>
        <IconButton aria-label="Delete Note" onClick={() => onDeleteClicked(noteId)} icon={<DeleteIcon />} />
      </Box>
    </Box>
  )
}