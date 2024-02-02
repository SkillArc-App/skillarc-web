import 'dotenv/config'

import { defineConfig } from 'cypress'
import createActiveSeeker from 'cypress/tasks/createActiveSeeker'
import createCoach from 'cypress/tasks/createCoach'
import createRecruiterWithApplicant from 'cypress/tasks/createRecruiterWithApplicant'
import createSeeker from 'cypress/tasks/createSeeker'
import createSeekerLead from 'cypress/tasks/createSeekerLead'
import createUser from 'cypress/tasks/createUser'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        createUser,
        createCoach,
        createRecruiterWithApplicant,
        createActiveSeeker,
        createSeeker,
        createSeekerLead,
      })
    },
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 15000,
  },
})
