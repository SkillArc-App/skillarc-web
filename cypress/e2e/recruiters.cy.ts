export {}

describe('Recruiters', () => {
  beforeEach(() => {
    cy.task('createRecruiterWithApplicant').then((response: any) => {
      cy.wrap(response['recruiter']).as('recruiter')
      cy.wrap(response['applicant']).as('applicant')
      cy.wrap(response['job']).as('job')
      cy.wrap(response['applicant_status']).as('applicant_status')
    })
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

          cy.findByLabelText('Show Passes/Hires').parent().click()
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
              cy.get('select').select('hire')
            })

          cy.findByLabelText('Show Passes/Hires').parent().click()
          cy.findByText(`${applicant['first_name']} ${applicant['last_name']}`).click()

          cy.url().should('contain', '/profiles/')
          cy.get('body').should('contain', applicant['first_name'])
          cy.get('body').should('contain', applicant['last_name'])
        })
      })
    })
  })
})
