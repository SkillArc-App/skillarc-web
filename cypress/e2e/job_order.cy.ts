export {}

describe('Admin', () => {
  beforeEach(() => {
    cy.task('createJob').then((r: any) => {
      cy.wrap(r).as('job')
    })
    cy.task('assertNoFailedJobs')
  })

  it('should navigate through job orders', () => {
    cy.visit('/')

    const emailSelect = cy.get('select').filter((_, element) => {
      return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
    })
    emailSelect.should('be.enabled')
    emailSelect.select('job_order@skillarc.com', { timeout: 10000 })

    cy.get('@job').then((job: any) => {
      cy.visit('/orders')

      cy.findByRole('table').within(() => {
        cy.findByText('Opened At').click()

        const row = cy.findByText(job.employmentTitle).parent().parent()

        row.within(() => {
          cy.findByText('Provide Order Count')
          cy.findByText('Needs Order Count')
        })

        cy.findByText(job.employmentTitle).click()
      })

      cy.findByText(job.employmentTitle)
      cy.findByText('Needs Order Count')
      cy.findByLabelText('Order Count*').clear().type('12')
      cy.findByRole('button', { name: 'Update' }).click()
      cy.findByText('Order Count: 12')
      cy.findByText('Open')
    })
  })
})
