import 'dotenv/config'

import { defineConfig } from 'cypress'
import createActiveSeeker from 'cypress/tasks/createActiveSeeker'
import createCoach from 'cypress/tasks/createCoach'
import createJob from 'cypress/tasks/createJob'
import createRecruiterWithApplicant from 'cypress/tasks/createRecruiterWithApplicant'
import createSeeker from 'cypress/tasks/createSeeker'
import createSeekerLead from 'cypress/tasks/createSeekerLead'
import createTrainerWithStudent from 'cypress/tasks/createTrainerWithStudent'
import createUser from 'cypress/tasks/createUser'
import assertNoFailedJobs from 'cypress/tasks/assertNoFailedJobs'
import clearFailedJobs from 'cypress/tasks/clearFailedJobs'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        assertNoFailedJobs,
        createUser,
        createCoach,
        createRecruiterWithApplicant,
        createActiveSeeker,
        clearFailedJobs,
        createSeeker,
        createJob,
        createSeekerLead,
        createTrainerWithStudent,
      })
    },
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 15000,
  },
})
