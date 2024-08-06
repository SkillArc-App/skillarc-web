export {}

describe('Coaches Attributes', () => {
  beforeEach(() => {
    cy.task('createCoach').then((r: any) => {
      cy.wrap(r).as('coach')
    })
    cy.task('createActiveSeeker').then((r: any) => {
      cy.wrap(r['person']).as('person')
    })
    cy.task('assertNoFailedJobs')
  })

  it('should navigate through coaches dashboard', () => {
    cy.visit('/coaches')
    cy.url().should('contain', '/coaches/seekers')
    cy.findByRole('tab', { name: 'Seekers' }).should('have.attr', 'aria-selected', 'true')

    let coachEmail = ''

    cy.get('@coach').then((coach: any) => {
      coachEmail = coach['email']

      cy.findByLabelText('Mock Auth Enabled').select(coachEmail, { timeout: 10000 })
    })

    cy.get('@person').then((person: any) => {
      cy.get('label').contains('Owned by Me').parent().click()

      cy.findByRole('table').within(() => {
        const row = cy.findByText(`${person['firstName']} ${person['lastName']}`).parent().parent()

        row.within(() => {
          cy.findByRole('link', { name: 'Dash' }).click()
        })
      })

      cy.get('body', { timeout: 10000 }).should(
        'contain',
        `${person['firstName']} ${person['lastName']}`,
      )

      cy.findByRole('button', { name: 'add-attribute' }).click()

      cy.findByDisplayValue('Attribute').select('Background')
      cy.get('body').contains('Add a value').next().type('Misdemeanor{enter}')
      cy.findByRole('button', { name: 'Save' }).click()

      // Note this is mostly a hack because the
      // Owned by mean is flaky
      const coachSelect = cy.contains('p', 'Assigned Coach').parent().find('select')
      coachSelect.select(coachEmail)
      coachSelect.find('option:selected').should('have.text', coachEmail)

      cy.findByText('< Back to Seekers').click()

      cy.findByLabelText('Background').type('Felony{Enter}')
      cy.findByText(`${person['firstName']} ${person['lastName']}`).should('not.exist')

      cy.findByLabelText('Background').clear()
      cy.findByLabelText('Background').type('Misdemeanor{Enter}')
      cy.findByText(`${person['firstName']} ${person['lastName']}`)

      cy.findByLabelText('Background').clear()
      cy.findByRole('search').type(crypto.randomUUID())
      cy.findByText(`${person['firstName']} ${person['lastName']}`).should('not.exist')

      cy.findByRole('search').clear().type(person['email'])
      cy.findByText(`${person['firstName']} ${person['lastName']}`)
    })
  })
})
