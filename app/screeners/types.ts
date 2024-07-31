import { PartialRequired } from '@/common/types/partial-required'
import { DocumentStatus } from '@/documents/types'

export type Questions = {
  id: string
  title: string
  questions: string[]
  createdAt: string
}

export type QuestionsRequest = PartialRequired<Questions, 'title' | 'questions'>

export type Answers = {
  id: string
  title: string
  questionResponses: AnswerResponse[]
  screenerQuestionsId: string
  documentsScreenersId?: string
  documentStatus?: DocumentStatus
  personId: string
  createdAt: string
}

export type AnswersRequest = Omit<Answers, 'createdAt' | 'id'> & { id?: string }

export type AnswerResponse = {
  question: string
  response: string
}
