import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, HStack, IconButton, Text, Textarea } from "@chakra-ui/react"
import { FocusEventHandler, useEffect, useRef, useState } from "react"

interface NoteProps {
  note: string
  noteId: string
  onDeleteClicked(id: string): void
  onNoteModified(id: string, note: string): void
}

export const NoteBox = ({ note, noteId, onDeleteClicked, onNoteModified }: NoteProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [noteDraft, setNoteDraft] = useState(note)

  const toggleEditing = () => {
    if (isEditing) {
      setNoteDraft(note);
      setIsEditing(false);
    } else {
      setIsEditing(true)
    }
  }

  const textComponent = isEditing ? (
    <Textarea
      autoFocus
      placeholder="Modify a note"
      bg={'white'}
      onChange={(e) => {
        setNoteDraft(e.target.value)
      }}
      value={noteDraft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onNoteModified(noteId, noteDraft)
          setIsEditing(false)
        }
      }}
    />
  ) : (
    <Text variant={'b2'}>{note}</Text>
  )

  return (
    <Box boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)" bg={'white'} py={'1rem'} px={'0.5rem'}>
      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} flexDir="row">
        {textComponent}
        <HStack>
          <IconButton
            aria-label="Delete Note"
            onClick={() => onDeleteClicked(noteId)}
            icon={<DeleteIcon />}
          />
          <IconButton
            aria-label="Modify Note"
            onClick={toggleEditing}
            icon={<EditIcon />}
          />
        </HStack>
      </Box>
    </Box>
  )
}