import { post } from '@/frontend/http-common'

export default async function resetDBRails() {
  // make a post call to 3001/reset_test_database

  // const response = await fetch('http://localhost:3001/create_test_user', {
  //   method: 'POST',
  // })

  const response = await post('/create_test_user', {}, '')

  return response.data
}
