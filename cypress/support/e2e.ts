import '@testing-library/cypress/add-commands'

afterEach(() => {
  cy.task('assertNoFailedJobs')
})

beforeEach(() => {
  cy.task('clearFailedJobs')
})

export {}
