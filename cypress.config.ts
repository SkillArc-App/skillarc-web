import { defineConfig } from 'cypress'
import resetDB from 'cypress/tasks/resetDB'
import resetDBRails from 'cypress/tasks/resetDBRails'
import seedDB from 'cypress/tasks/seedDB'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        resetDB,
        resetDBRails,
        seedDB,
      })
    },
    experimentalRunAllSpecs: true,
  },
})
