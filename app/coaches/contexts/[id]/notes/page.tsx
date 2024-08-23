'use client'

import { useCoachSeekerData } from '@/coaches/hooks/useCoachSeekerData'
import { useContactMutation } from '@/coaches/hooks/useContactMutation'
import { ContactDirection, ContactType } from '@/coaches/types'
import { IdParams } from '@/common/types/PageParams'
import { LoadingPage } from '@/components/Loading'
import TimeLine, { TimeLineItem } from '@/components/TimeLine'
import { useAuthToken } from '@/hooks/useAuthToken'
import { destroy, post, put } from '@/http-common'
import { HStack, IconButton, Radio, RadioGroup, Stack, Tooltip } from '@chakra-ui/react'
import { useState } from 'react'
import { FaComment, FaEnvelope, FaPhone } from 'react-icons/fa6'

function contactIcon(contactType: ContactType) {
  return contactType === ContactType.EMAIL ? (
    <FaEnvelope />
  ) : contactType === ContactType.SMS ? (
    <FaComment />
  ) : (
    <FaPhone />
  )
}

function contactTypeNote(contactType: ContactType) {
  switch (contactType) {
    case ContactType.EMAIL:
      return 'Email'
    case ContactType.PHONE:
      return 'Phone Call'
    case ContactType.SMS:
      return 'Text'
  }
}

const Notes = ({ params: { id } }: IdParams) => {
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)
  const contact = useContactMutation()
  const [direction, setDirection] = useState<ContactDirection>(ContactDirection.SENT)

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

  const notes: TimeLineItem[] = seeker.notes.map((note) => ({ kind: 'note', ...note }))

  const markers: TimeLineItem[] = seeker.contacts.map(
    ({ note, contactedAt, contactType, contactDirection }) => {
      return {
        kind: 'marker',
        date: contactedAt,
        note: `${contactTypeNote(contactType)} ${contactDirection} ${note}`,
        icon: contactIcon(contactType),
      }
    },
  )

  const items = notes.concat(markers)

  return (
    <Stack>
      <HStack>
        <RadioGroup onChange={(value) => setDirection(value as ContactDirection)} value={direction}>
          <Stack direction="row">
            <Radio aria-label='Communication sent' value={ContactDirection.SENT}>Sent</Radio>
            <Radio aria-label='Communication received' value={ContactDirection.RECEIVED}>Received</Radio>
          </Stack>
        </RadioGroup>
        <Tooltip label={`Seeker Email Communication Occurred`}>
          <IconButton
            aria-label="Email Communication"
            onClick={() =>
              contact.mutate({
                id,
                contactDirection: direction,
                contactType: ContactType.EMAIL,
                note: '',
              })
            }
            icon={contactIcon(ContactType.EMAIL)}
          />
        </Tooltip>

        <Tooltip label={`Seeker Text Communication Occurred`}>
          <IconButton
            aria-label="Text Communication"
            onClick={() =>
              contact.mutate({
                id,
                contactDirection: direction,
                contactType: ContactType.SMS,
                note: '',
              })
            }
            icon={contactIcon(ContactType.SMS)}
          />
        </Tooltip>

        <Tooltip label={`Seeker Phone Communication Occurred`}>
          <IconButton
            aria-label="Phone Communication"
            onClick={() =>
              contact.mutate({
                id,
                contactDirection: direction,
                contactType: ContactType.PHONE,
                note: '',
              })
            }
            icon={contactIcon(ContactType.PHONE)}
          />
        </Tooltip>
      </HStack>
      <TimeLine items={items} onCreate={addNote} onDelete={deleteNote} onModify={modifyNote} />
    </Stack>
  )
}

export default Notes
