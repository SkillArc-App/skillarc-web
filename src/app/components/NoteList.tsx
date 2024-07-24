import { Heading } from '@/app/components/Heading'
import { GroupedNotes, Note } from '@/common/types/Note'
import { Stack, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { NoteBox } from './NoteBox'

interface NotesListProps {
  notes: Note[]
  onCreate(note: string): Promise<void>
  onDelete(id: string): Promise<void>
  onModify(id: string, note: string): Promise<void>
}

export default function NotesList({ notes, onCreate, onDelete, onModify }: NotesListProps) {
  const [noteDraft, setNoteDraft] = useState('')

  const groupedNotes = notes
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .reduce((acc: GroupedNotes, curr) => {
      const month = new Date(curr.date).getMonth()
      const year = new Date(curr.date).getFullYear()

      const yearMonthDate = new Date(year, month).toString()

      const monthNotes = acc[yearMonthDate] || []

      return { ...acc, [yearMonthDate]: [...monthNotes, curr] }
    }, {})

  return (
    <Stack pr={'1rem'} gap={'1rem'} overflowY={'scroll'}>
      <Textarea
        placeholder="Add a note"
        bg={'white'}
        onChange={(e) => {
          setNoteDraft(e.target.value)
        }}
        value={noteDraft}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            await onCreate(noteDraft)
            setNoteDraft('')
            e.preventDefault()
          }
        }}
      />
      {Object.entries(groupedNotes)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, notes]) => (
          <Stack key={date}>
            <Heading type="h3" color={'black'}>
              {new Date(date).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Heading>
            {notes.map((note) => (
              <NoteBox
                key={note.noteId}
                note={note}
                onDeleteClicked={onDelete}
                onNoteModified={onModify}
              />
            ))}
          </Stack>
        ))}
    </Stack>
  )
}
