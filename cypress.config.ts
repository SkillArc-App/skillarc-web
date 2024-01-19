import 'dotenv/config'

import { defineConfig } from 'cypress'
import createActiveSeeker from 'cypress/tasks/createActiveSeeker'
import createCoach from 'cypress/tasks/createCoach'
import createSeeker from 'cypress/tasks/createSeeker'
import createUser from 'cypress/tasks/createUser'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        createUser,
        createCoach,
        createActiveSeeker,
        createSeeker,
      })
    },
    experimentalRunAllSpecs: true,
  },
})
