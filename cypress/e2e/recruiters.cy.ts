export {}

describe('Recruiters', () => {
  beforeEach(() => {
    cy.task('createRecruiterWithApplicant').then((response: any) => {
      cy.wrap(response['recruiter']).as('recruiter')
      cy.wrap(response['applicant']).as('applicant')
      cy.wrap(response['job']).as('job')
      cy.wrap(response['applicant_status']).as('applicant_status')
    })
    cy.task('assertNoFailedJobs')
  })

  it('should navigate through employers dashboard', () => {
    cy.get('@recruiter').then((recruiter: any) => {
      cy.visit('/')
      cy.get('div').contains('mock auth')
      const emailSelect = cy.get('select').filter((_, element) => {
        return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
      })

      emailSelect.should('be.enabled')
      emailSelect.select(recruiter['email'], { timeout: 10000 })
    })

    cy.visit('/employers/jobs')

    cy.get('@applicant').then((applicant: any) => {
      cy.get('@job').then((job: any) => {
        cy.get('@applicant_status').then((applicant_status: any) => {
          cy.findByRole('tab', { name: job['employment_title'] }).click()

          cy.get('table')
            .should('contain', `${applicant['first_name']} ${applicant['last_name']}`)
            .should('contain', `${job['employment_title']}`)
            .should('contain', `${applicant_status['status']}`)

          cy.get('table').within(() => {
            cy.findByLabelText('Start conversation with applicant').click()
          })

          cy.get('body', { timeout: 10000 }).should(
            'contain',
            `${applicant['first_name']} ${applicant['last_name']} - ${job['employment_title']}`,
          )

          const message =
            'We are looking forward to speaking with you is there a time this week that works for you?'

          cy.url().should('contain', '/employers/chats/')
          cy.findByPlaceholderText('Type a message...').type(message).type('{enter}')

          cy.get('body').should('contain', message)

          cy.go('back')

          cy.get('table')
            .should('contain', `${applicant['first_name']} ${applicant['last_name']}`)
            .should('contain', `${job['employment_title']}`)
            .should('contain', `${applicant_status['status']}`)
            .within(() => {
              cy.get('select').should('be.enabled')
              cy.get('select').parent().click()
              cy.get('select').select('pass')
            })

          cy.findByText('Give us Feedback')
          // Chakra UI Tom foolery
          cy.findByLabelText('The role is filled, no longer accepting applications').click({
            force: true,
          })
          cy.findByPlaceholderText('Can you provide some details...').type(
            'We already have the best candidate',
          )
          cy.findByRole('button', { name: 'Submit' }).click()

          cy.findByText(`${applicant['first_name']} ${applicant['last_name']}`).should('not.exist')

          const box = cy.findByRole('checkbox')
          box.should('not.be.checked')
          box.click({ force: true })

          // Have to refind checkbox because the DOM is updated
          cy.findByRole('checkbox').should('be.checked')

          cy.findByText('The role is filled, no longer accepting applications')
          cy.findByText(`${applicant['first_name']} ${applicant['last_name']}`).click()

          cy.url().should('contain', '/profiles/')
          cy.get('body').should('contain', applicant['first_name'])
          cy.get('body').should('contain', applicant['last_name'])
        })
      })
    })
  })
})
