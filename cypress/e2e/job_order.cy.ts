export {}

const reloadUntilConditionMet = (
  predicate: () => Cypress.Chainable<boolean>,
  { retryCount = 5, delay = 1000 } = {},
) => {
  const retrier = (count = retryCount) => {
    predicate().then((result) => {
      if (count === 0) {
        predicate().should('be.true')
      }
      if (result) {
        return
      } else {
        cy.wait(delay)
        cy.reload()
        retrier(count - 1)
      }
    })
  }

  retrier()
}

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

    cy.findByLabelText('Mock Auth Enabled').select('job_order@skillarc.com', { timeout: 10000 })

    cy.get('@person').then((person: any) => {
      cy.get('@job').then((job: any) => {
        cy.get('@employer').then((employer: any) => {
          cy.visit('/orders')

          // Find job order in table
          cy.findByRole('table').within(() => {
            cy.findByText('Opened At').click()

            const row = cy.findByText(job.employmentTitle).parent().parent().parent()

            row.within(() => {
              cy.findByText('Needs Order Count')
            })

            cy.findByText(job.employmentTitle).click()
          })

          // Set order count
          let headingCard = cy
            .findByRole('heading', { name: `${job.employmentTitle} - ${employer.name}` })
            .parent()
            .parent()
            .parent()

          headingCard.within(() => {
            cy.findByText('Needs Order Count')
            cy.findByLabelText('Order Count*').clear().type('1')
            cy.findByRole('button', { name: 'Update' }).click()
            cy.findByText('Order Count: 1')
            cy.findByText('Needs Job Criteria Set')
          })

          // Switch to admin role and set attributes for our job
          cy.visit('/')
          cy.findByLabelText('Mock Auth Enabled').select('admin@skillarc.com', {
            timeout: 10000,
          })

          cy.visit('/admin')
          cy.findByRole('link', { name: 'Jobs' }).click()
          cy.findByText(job.employmentTitle).click()

          cy.findByRole('tab', { name: 'The Basics' }).click()
          cy.findByRole('button', { name: 'edit' }).click()

          // assign "the basics"
          cy.findByRole('radio', { name: 'Staffing' }).check({ force: true })
          cy.findByPlaceholderText('Benefits Description').type('Great benefits')
          cy.findByPlaceholderText('Responsibilities Description').type('Great responsibilities')
          cy.findByPlaceholderText('Requirements Description').type('Great requirements')
          cy.findByText('Save').click()

          // assign job attributes
          cy.findByRole('tab', { name: 'Attributes' }).click()
          cy.findByRole('button', { name: '+ New Job Attribute' }).click()
          cy.findByDisplayValue('Attribute').select('Background')
          cy.findByLabelText('Acceptable Values').type('Misdemeanor{Enter}')
          cy.findByRole('button', { name: 'Save' }).click()

          // switch back to job order admin
          cy.visit('/')

          cy.findByLabelText('Mock Auth Enabled').select('job_order@skillarc.com', {
            timeout: 10000,
          })
          cy.visit('/orders')

          // Find job order again in table
          cy.findByRole('table').within(() => {
            cy.findByText('Opened At').click()

            cy.findByText(job.employmentTitle).click()
          })

          reloadUntilConditionMet(
            () => {
              return cy.get('body').then((el) => el.text().includes('Open'))
            },
            { retryCount: 8 },
          )

          cy.findByRole('table').within(() => {
            cy.findByText(`${person['firstName']} ${person['lastName']}`).click()
          })

          cy.findByLabelText('Status').select(`Sent to Employer`)
          cy.findByRole('button', { name: 'Save' }).click()

          headingCard = cy
            .findByRole('heading', { name: `${job.employmentTitle} - ${employer.name}` })
            .parent()
            .parent()
            .parent()

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
          cy.findByText('Close Without Filling').click()
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
              cy.findByText('Needs Order Count')
            })

            cy.findByText(job.employmentTitle).click()
          })

          cy.findByRole('tab', { name: 'Screener Questions' }).click()
          cy.findByRole('button', { name: 'New Screener Questions' }).click()

          cy.findByLabelText('Screener Title*').type('New And Improved Screener')
          cy.findByLabelText('Question 1*').type('What is your favorite Candy?')

          cy.findByRole('button', { name: 'Add a Question' }).click()
          cy.findByLabelText('Question 2*').type('How is your personal hero?')

          cy.findByLabelText('Question 1*').parent().next().click()
          cy.findByRole('button', { name: 'Save'}).click()

          cy.findByText('New And Improved Screener')
        })
      })
    })
  })
})
