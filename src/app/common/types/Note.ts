export type Note = {
  date: string
  note: string
  noteId: string
  noteTakenBy: string
}

export type GroupedNotes = {
  [key: string]: Note[]
}