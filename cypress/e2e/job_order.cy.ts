export {}

describe('Job Orders', () => {
  beforeEach(() => {
    cy.task('createActiveSeeker').then((r: any) => {
      cy.wrap(r['person']).as('person')
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

    cy.get('@person').then((person: any) => {
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
          const headingCard = cy
            .findByRole('heading', { name: `${job.employmentTitle} - ${employer.name}` })
            .parent()
            .parent()
            .parent()

          headingCard.within(() => {
            cy.findByText('Needs Order Count')
            cy.findByLabelText('Order Count*').clear().type('1')
            cy.findByRole('button', { name: 'Update' }).click()
            cy.findByText('Order Count: 1')
            cy.findByText('Open')
          })

          cy.findByRole('table').within(() => {
            cy.findByText(`${person['firstName']} ${person['lastName']}`).click()
          })

          cy.findByLabelText('Status').select(`Sent to Employer`)
          cy.findByRole('button', { name: 'Save' }).click()

          headingCard.within(() => {
            cy.findByText('Waiting on Employer')
          })

          // Add and then modify a note
          const noteInput = cy.findByPlaceholderText('Add a note')
          noteInput.type('This is a note').type('{enter}')
          noteInput.should('have.value', '')

          cy.findByText('This is a note')
          cy.findByLabelText('Modify Note').click()

          cy.findByPlaceholderText('Modify a note')
            .type('{selectall}{backspace}')
            .type('This is a new note')
            .type('{enter}')

          cy.findByText('This is a new note')
          cy.get('body').should('not.contain', 'This is a note')

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
              cy.findByText('1')
            })
          })

          cy.findByText('Show Closed Orders').parent().click()

          cy.findByText('Create New Job Order').click()
          cy.findByText('Create A New Job Order')

          cy.findByLabelText('Select Job').select(`${job.employmentTitle}: ${employer.name}`)
          cy.findByText('Save').click()

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
})
