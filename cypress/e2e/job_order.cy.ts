export {}

describe('Admin', () => {
  beforeEach(() => {
    cy.task('createJob').then((r: any) => {
      cy.wrap(r['job']).as('job')
      cy.wrap(r['employer']).as('employer')
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
      cy.get('@employer').then((employer: any) => {
        cy.visit('/orders')

        // Find job order in table
        cy.findByRole('table').within(() => {
          cy.findByText('Opened At').click()

          const row = cy.findByText(job.employmentTitle).parent().parent().parent()

          row.within(() => {
            cy.findByText('Provide Order Count')
            cy.findByText('Needs Order Count')
          })

          cy.findByText(job.employmentTitle).click()
        })

        // Set order count
        cy.findByText(job.employmentTitle)
        cy.findByText('Needs Order Count')
        cy.findByLabelText('Order Count*').clear().type('12')
        cy.findByRole('button', { name: 'Update' }).click()
        cy.findByText('Order Count: 12')
        cy.findByText('Open')

        // close order
        cy.findByText('Close Job Order Without Filling').click()
        cy.findByText('Closed Without Filling')

        cy.findByText('< Back to Orders').click()
        cy.findByText('Show Closed Orders').parent().click()

        // confirm order is closed with order count
        cy.findByRole('table').within(() => {
          cy.findByText('Opened At').click()

          const row = cy.findByText(job.employmentTitle).parent().parent().parent()

          row.within(() => {
            cy.findByText('Closed Without Filling')
            cy.findByText('12')
          })
        })

        cy.findByText('Show Closed Orders').parent().click()

        cy.findByText('Create New Job Order').click()
        cy.findByText('Create A New Job Order')

        cy.findByLabelText('Select Job').select(`${job.employmentTitle}: ${employer.name}`)
        cy.findByText("Save").click()

        cy.findByRole('table').within(() => {
          cy.findByText('Opened At').click()

          const row = cy.findByText(job.employmentTitle).parent().parent().parent()

          row.within(() => {
            cy.findByText('Provide Order Count')
            cy.findByText('Needs Order Count')
          })

          cy.findByText(job.employmentTitle).click()
        })
      })
    })
  })
})
