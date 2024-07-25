import { post } from 'app/http-common'

export default async function createTrainerWithStudent() {
  const response = await post('/test/create_test_trainer_with_student', {}, '')

  return response.data
}
