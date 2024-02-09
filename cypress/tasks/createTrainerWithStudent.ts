import { post } from '@/frontend/http-common'

export default async function createTrainerWithStudent() {
  const response = await post('/test/create_test_trainer_with_student', {}, '', { camel: true })

  return response.data
}
