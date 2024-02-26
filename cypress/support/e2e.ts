import '@testing-library/cypress/add-commands'

afterEach(() => {
  cy.task('assertNoFailedJobs')
})

export {}
