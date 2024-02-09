export {}

describe('Onboarding', () => {
  beforeEach(() => {
    cy.task('createTrainerWithStudent').then((response: any) => {
      cy.wrap(response['trainer']).as('trainer')
      cy.wrap(response['student']).as('student')
      cy.wrap(response['trainingProvider']).as('trainingProvider')
      cy.wrap(response['program']).as('program')
    })
  })

  it('should navigate through onboarding', () => {
    cy.get('@trainer').then((trainer: any) => {
      cy.visit('/')
      cy.get('div').contains('mock auth')
      const emailSelect = cy.get('select').filter((_, element) => {
        return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
      })

      emailSelect.should('be.enabled')
      emailSelect.select(trainer['email'], { timeout: 10000 })
    })

    cy.visit('/students')

    cy.get('@student').then((student: any) => {
      cy.get('@program').then((program: any) => {
        cy.findByText(program['name'])

        // Change enrollment
        const initialRow = cy.findByText(`${student['firstName']} ${student['lastName']}`).parent()
        initialRow.within(() => {
          cy.findByText('Profile Complete')

          cy.findByText('Not Enrolled').should('not.have.attr', 'data-checked')
          cy.findByText('Enrolled').should('have.attr', 'data-checked')
          cy.findByText('Graduated').should('not.have.attr', 'data-checked')

          cy.findByText('Graduated').click()
          cy.findByText('Not Enrolled').should('not.have.attr', 'data-checked')
          cy.findByText('Enrolled').should('not.have.attr', 'data-checked')
          cy.findByText('Graduated').should('have.attr', 'data-checked')

          cy.findByRole('link', { name: '+ Add Reference' }).click()
        })

        // Write a reference
        cy.findByRole('heading', { name: `Write a reference for:` })
        cy.findByRole('heading', { name: `${student['firstName']} ${student['lastName']}` })
        cy.get('textarea').type('This student is great!')
        cy.findByRole('button', { name: 'Submit' }).click()

        const withReferenceRow = cy.findByText(`${student['firstName']} ${student['lastName']}`).parent()
        withReferenceRow.within(() => {
          cy.findByText('Profile Complete')

          cy.findByText('Not Enrolled').should('not.have.attr', 'data-checked')
          cy.findByText('Enrolled').should('not.have.attr', 'data-checked')
          cy.findByText('Graduated').should('have.attr', 'data-checked')

          cy.findByRole('link', { name: 'Edit' })
        })

        // Add an invite
        cy.findByRole('button', { name: 'Invite Students' }).click()

        cy.findByText('Invite Students')
        cy.findByText('Add program participants to assist them successfully apply to jobs')

        cy.findByPlaceholderText('First Name').type('John')
        cy.findByPlaceholderText('Last Name').type('Chabot')
        cy.findByPlaceholderText('Email Address').type('john@skillarc.com')
        cy.findByText('Program').parent().select(program['name'])

        cy.findByRole('button', { name: 'Send Invites' }).click()

        cy.url().should('contain', '/students')

        const inviteRow = cy.findByText('John Chabot').parent()
        inviteRow.within(() => {
          cy.findByText('No Profile')
        })
      })
    })
  })
})
