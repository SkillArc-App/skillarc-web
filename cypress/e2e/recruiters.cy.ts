export {}

describe('Recruiters', () => {
  beforeEach(() => {
    cy.task('createRecruiterWithApplicant').then((response: any) => {
      cy.wrap(response['recruiter']).as('recruiter')
      cy.wrap(response['applicant']).as('applicant')
      cy.wrap(response['job']).as('job')
      cy.wrap(response['applicantStatus']).as('applicantStatus')
    })
    cy.task('assertNoFailedJobs')
  })

  it('should navigate through employers dashboard', () => {
    cy.visit('/')

    cy.get('@recruiter').then((recruiter: any) => {
      cy.findByLabelText('Mock Auth Enabled').select(recruiter['email'], { timeout: 10000 })
    })

    cy.visit('/employers/jobs')

    cy.get('@applicant').then((applicant: any) => {
      cy.get('@job').then((job: any) => {
        cy.get('@applicantStatus').then((applicantStatus: any) => {
          cy.findByRole('tab', { name: job['employmentTitle'] }).click()

          cy.get('table')
            .should('contain', `${applicant['firstName']} ${applicant['lastName']}`)
            .should('contain', `${job['employmentTitle']}`)
            .should('contain', `${applicantStatus['status']}`)

          cy.get('table').within(() => {
            cy.findByLabelText('Start conversation with applicant').click()
          })

          cy.get('body', { timeout: 15000 }).should(
            'contain',
            `${applicant['firstName']} ${applicant['lastName']} - ${job['employmentTitle']}`,
          )

          const message =
            'We are looking forward to speaking with you is there a time this week that works for you?'

          cy.url().should('contain', '/employers/chats/')
          cy.findByPlaceholderText('Type a message...').type(message).type('{enter}')

          cy.get('body').should('contain', message)

          cy.go('back')

          cy.get('table')
            .should('contain', `${applicant['firstName']} ${applicant['lastName']}`)
            .should('contain', `${job['employmentTitle']}`)
            .should('contain', `${applicantStatus['status']}`)
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

          cy.findByText(`${applicant['firstName']} ${applicant['lastName']}`).should('not.exist')

          const box = cy.findByRole('checkbox')
          box.should('not.be.checked')
          box.click({ force: true })

          // Have to refind checkbox because the DOM is updated
          cy.findByRole('checkbox').should('be.checked')

          cy.findByText('The role is filled, no longer accepting applications')
          cy.findByText(`${applicant['firstName']} ${applicant['lastName']}`).click()

          cy.url().should('contain', '/profiles/')
          cy.get('body').should('contain', applicant['firstName'])
          cy.get('body').should('contain', applicant['lastName'])
        })
      })
    })
  })
})
