export default async function resetDBRails() {
  // make a post call to 3001/reset_test_database

  const response = await fetch('http://localhost:3002/reset_test_database', {
    method: 'POST',
  }).then(() => {
    return true
  })

  return false
}
