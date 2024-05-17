'use client'

import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import NotesList from '@/app/components/NoteList'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { destroy, post, put } from '@/frontend/http-common'

const Notes = () => {
  const { id } = useFixedParams('id')
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)

  const token = useAuthToken()

  const addNote = async (note: string) => {
    if (!token) return
    if (!seeker) return

    await post(
      `/coaches/contexts/${id}/notes`,
      {
        note: note,
        noteId: crypto.randomUUID(),
      },
      token,
    )

    refetchSeeker()
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
    <NotesList
      notes={seeker.notes}
      onCreate={addNote}
      onDelete={deleteNote}
      onModify={modifyNote}
    />
  )
}

export default Notes
