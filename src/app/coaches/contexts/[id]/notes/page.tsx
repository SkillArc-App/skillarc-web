'use client'

import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import { SeekerNote } from '@/app/coaches/types'
import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { destroy, post, put } from '@/frontend/http-common'
import { Stack, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { NoteBox } from './components/NoteBox'

interface GroupedNotes {
  [key: string]: SeekerNote[]
}

const Notes = () => {
  const { id } = useFixedParams('id')
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)

  const [noteDraft, setNoteDraft] = useState('')

  const token = useAuthToken()

  const groupedNotes = (seeker?.notes ?? [])
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

  const addNote = async () => {
    if (!token) return
    if (!noteDraft) return
    if (!seeker) return

    const currentNoteDraft = noteDraft
    const noteId = crypto.randomUUID()

    await post(
      `/coaches/contexts/${id}/notes`,
      {
        note: currentNoteDraft,
        noteId,
      },
      token,
    )

    refetchSeeker()
    setNoteDraft('')
  }

  const deleteNote = async (noteId: string) => {
    if (!token) return
    if (!seeker) return

    await destroy(`/coaches/contexts/${id}/notes/${noteId}`, token)

    refetchSeeker()
  }

  const modifyNote = async (noteId: string, updatedNote: string) => {
    if (!token) return
    if (!seeker) return

    await put(
      `/coaches/contexts/${id}/notes/${noteId}`,
      {
        note: updatedNote,
      },
      token,
    )

    refetchSeeker()
  }

  if (!seeker) return <LoadingPage />

  return (
    <Stack pr={'1rem'} gap={'1rem'} overflowY={'scroll'}>
      <Textarea
        placeholder="Add a note"
        bg={'white'}
        onChange={(e) => {
          setNoteDraft(e.target.value)
        }}
        value={noteDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addNote()
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
                onDeleteClicked={deleteNote}
                onNoteModified={modifyNote}
              />
            ))}
          </Stack>
        ))}
    </Stack>
  )
}

export default Notes
