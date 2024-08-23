import { Marker } from '@/common/types/Marker'
import { Note } from '@/common/types/Note'
import { Heading } from '@/components/Heading'
import { Stack, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { MarkerBox } from './MarkerBox'
import { NoteBox } from './NoteBox'

type TimeLineNote = Note & { kind: 'note' }
type TimeLineMarker = Marker & { kind: 'marker' }
export type TimeLineItem = TimeLineNote | TimeLineMarker

export type GroupedItem = {
  [key: string]: TimeLineItem[]
}

interface TimeLineProps {
  items: TimeLineItem[]
  onCreate(note: string): Promise<void>
  onDelete(id: string): Promise<void>
  onModify(id: string, note: string): Promise<void>
}

export default function TimeLine({ items, onCreate, onDelete, onModify }: TimeLineProps) {
  const [noteDraft, setNoteDraft] = useState('')

  const groupedItems = items
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .reduce((acc: GroupedItem, curr) => {
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
            if (e.altKey) {
              setNoteDraft((value) => value + '\n')
            } else {
              await onCreate(noteDraft)
              setNoteDraft('')
              e.preventDefault()
            }
          }
        }}
      />
      {Object.entries(groupedItems)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, items]) => (
          <Stack key={date}>
            <Heading type="h3" color={'black'}>
              {new Date(date).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Heading>
            {items.map((item, index) => {
              if (item.kind == 'note') {
                return (
                  <NoteBox
                    key={index}
                    note={item}
                    onDeleteClicked={onDelete}
                    onNoteModified={onModify}
                  />
                )
              } else {
                return <MarkerBox key={index} marker={item} />
              }
            })}
          </Stack>
        ))}
    </Stack>
  )
}
