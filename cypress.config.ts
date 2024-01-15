import { defineConfig } from 'cypress'
import resetDBRails from 'cypress/tasks/resetDBRails'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        resetDBRails,
      })
    },
    experimentalRunAllSpecs: true,
  },
})
