export {}

describe('Job Orders', () => {
  beforeEach(() => {
    cy.task('createJob').then((r: any) => {
      cy.wrap(r['job']).as('job')
      cy.wrap(r['employer']).as('employer')
    })
    cy.task('createSeeker').then((r: any) => {
      cy.wrap(r['person']).as('person')
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

          const screenerName = crypto.randomUUID()

          // Create a new set of screener questions
          cy.findByRole('tab', { name: 'Screener Questions' }).click()
          cy.findByRole('button', { name: 'New Screener Questions' }).click()

          cy.findByLabelText('Screener Title*').type(screenerName)
          cy.findByLabelText('Question 1*').type('What is your favorite Candy?')

          cy.findByRole('button', { name: 'Add a Question' }).click()
          cy.findByLabelText('Question 2*').type('How is your personal hero?')

          cy.findByLabelText('Question 1*').parent().next().click()
          cy.findByRole('button', { name: 'Save' }).click()

          cy.findByText(screenerName)

          cy.findByRole('tab', { name: 'Orders' }).click()

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
          cy.findByLabelText('Category*').select('Staffing')
          cy.findByLabelText('Benefits Description*').type('Great benefits')
          cy.findByLabelText('Responsibilities Description*').type('Great responsibilities')
          cy.findByLabelText('Requirements Description*').type('Great requirements')
          cy.findByLabelText('Work days*').type('M-F')
          cy.findByLabelText('Schedule*').type('24/7')
          cy.findByText('Save').click()

          // assign job attributes
          cy.findByRole('tab', { name: 'Attributes' }).click()
          cy.findByRole('button', { name: '+ New Job Attribute' }).click()
          cy.findByDisplayValue('Attribute').select('Background')
          cy.findByLabelText('Acceptable Values').type('Misdemeanor{Enter}')
          cy.findByRole('button', { name: 'Save' }).click()

          // Apply to job as seeker
          cy.visit('/')

          cy.findByLabelText('Mock Auth Enabled').select(person.email, {
            timeout: 10000,
          })
          cy.visit('/jobs')

          const card = cy.findByRole('listitem', { name: job.employmentTitle })
          card.within(() => {
            cy.findByRole('button', { name: 'Apply' }).click()
          })

          cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()

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

          headingCard = cy
            .findByRole('heading', { name: `${job.employmentTitle} - ${employer.name}` })
            .parent()
            .parent()
            .parent()

          headingCard.within(() => {
            cy.findByText('Open')
          })

          // Click and assign screener
          cy.findByRole('button', { name: 'Assign Screener' }).click()
          cy.findByLabelText('Screener Questions').select(screenerName)
          cy.findByRole('button', { name: 'Save' }).click()

          // confirm screener assigned
          cy.findByText(`Screener: ${screenerName}`)

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
        })
      })
    })
  })
})
