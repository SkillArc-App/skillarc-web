'use client'

import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import { IdParams } from '@/app/common/types/PageParams'
import { LoadingPage } from '@/app/components/Loading'
import NotesList from '@/app/components/NoteList'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { destroy, post, put } from '@/app/http-common'

const Notes = ({ params: { id } }: IdParams) => {
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
