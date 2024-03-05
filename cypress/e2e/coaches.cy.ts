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

describe('Coaches', () => {
  beforeEach(() => {
    cy.task('createCoach').then((r: any) => {
      cy.wrap(r).as('coach')
    })
    cy.task('createActiveSeeker').then((r: any) => {
      cy.wrap(r).as('seeker')
    })
    cy.task('createSeekerLead').then((r: any) => {
      cy.wrap(r).as('lead')
    })
  })

  it('should navigate through coaches dashboard', () => {
    cy.visit('/coaches')
    cy.url().should('contain', '/coaches/seekers')
    cy.findByRole('tab', { name: 'Seekers' }).should('have.attr', 'aria-selected', 'true')

    let coachEmail = ''

    cy.get('@coach').then((coach: any) => {
      cy.get('div').contains('mock auth')
      coachEmail = coach['email']
      cy.get('select')
        .filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        .select(coachEmail)
    })

    cy.get('@seeker').then((seeker: any) => {
      cy.findByRole('table').within(() => {
        const row = cy.findByText(`${seeker['first_name']} ${seeker['last_name']}`).parent()

        row.within(() => {
          cy.findByRole('link', { name: 'Dash' }).click()
        })
      })

      cy.get('body', { timeout: 10000 }).should(
        'contain',
        `${seeker['first_name']} ${seeker['last_name']}`,
      )
      cy.get('body').should('contain', seeker['email'])
      cy.get('body').should('contain', 'Beginner')

      cy.get('body')
        .contains('Other Jobs')
        .next()
        .next()
        .within(() => {
          cy.get('button').contains('Recommend').click()
        })
      cy.get('body').should('contain', 'Cannot recommend job without phone number')

      cy.get('p').contains('Barriers').next().type('Background{enter}')
      cy.get('body').should('contain', 'Background')
      cy.get('body').should('not.contain', 'Unable to Drive')

      const noteInput = cy.get('textarea').filter('[placeholder="Add a note"]')
      noteInput.type('This is a note').type('{enter}')
      noteInput.should('have.value', '')

      cy.get('body').should('contain', 'This is a note')
      cy.get('button[aria-label="Modify Note"]').click()

      cy.get('textarea')
        .filter('[placeholder="Modify a note"]')
        .type('{selectall}{backspace}')
        .type('This is a new note')
        .type('{enter}')

      cy.get('body').should('contain', 'This is a new note')
      cy.get('body').should('not.contain', 'This is a note')

      const coachSelect = cy.contains('p', 'Assigned Coach').parent().find('select')
      coachSelect.select(coachEmail)
      coachSelect.find('option:selected').should('have.text', coachEmail)

      // save current route
      cy.url().then((url) => {
        cy.get('a').contains('Jump to Profile').click()
        cy.findByLabelText('Edit Profile').click()

        cy.get('p').contains('Phone number').next().clear().type('570-555-5555')
        cy.get('button').contains('Save').click()
        cy.visit(url)
      })

      reloadUntilConditionMet(() => {
        return cy
          .get('body')
          .contains('Phone Number')
          .next()
          .then((el) => el.text().includes('570-555-5555'))
      })

      cy.get('body')
        .contains('Other Jobs')
        .next()
        .next()
        .within(() => {
          cy.get('button').contains('Recommend').click()
          cy.get('div').should('contain', 'Recommended')
        })

      cy.findByRole('button', { name: 'Certify' }).click()
      cy.findByText(`By ${coachEmail}`)

      cy.findByRole('link', { name: '< Back to Seekers' }).click()

      cy.findByRole('tab', { name: 'Seekers' }).should('have.attr', 'aria-selected', 'true')

      const table = cy.findByRole('table')
      table.within(() => {
        const row = cy.findByText(`${seeker['first_name']} ${seeker['last_name']}`).parent()

        row.within(() => {
          cy.findAllByText(coachEmail).should((elements) => expect(elements).to.have.length(2))
          cy.findByRole('link', { name: 'Dash' }).click()
        })
      })

      cy.findByText('< Back to Seekers')
      cy.reload()

      cy.get('body').should('contain', 'This is a new note')
      cy.get('button[aria-label="Delete Note"]').click()
      cy.get('body').should('not.contain', 'This is a new note')

      cy.contains('p', 'Job Title')
        .parent()
        .within(() => {
          cy.get('a').click()
        })

      cy.url().should('contain', '/jobs/')
      cy.go('back')

      cy.get('a').contains('Jump to Profile').click()
      cy.findByLabelText('Edit Profile').click()

      cy.get('p').contains('First name').next().clear().type('Dwight')
      cy.get('p').contains('Last name').next().clear().type('Schrute')
      cy.get('p').contains('ZIP Code').next().clear().type('18503')
      cy.get('p').contains('Phone number').next().clear().type('570-555-5555')

      cy.get('button').contains('Save').click()

      cy.get('body').contains('Dwight Schrute')
      cy.get('body').contains('18503')
      cy.get('body').contains('570-555-5555')
    })

    cy.get('@lead').then((lead: any) => {
      cy.visit('/coaches')
      cy.findByRole('tab', { name: 'Leads' }).click()
      cy.url().should('contain', '/coaches/leads')

      cy.findByRole('tab', { name: 'Leads' }).should('have.attr', 'aria-selected', 'true')

      cy.get('table').should('contain', lead['first_name'])
      cy.get('table').should('contain', lead['last_name'])
      cy.get('table').should('contain', lead['phone_number'])

      cy.findByRole('button', { name: 'New Lead' }).click()

      const newLead = {
        firstName: crypto.randomUUID(),
        lastName: crypto.randomUUID(),
        phoneNumber: Math.floor(Math.random() * 999_999_9999).toString(),
      }

      cy.findByLabelText('First Name*').type(newLead.firstName)
      cy.findByLabelText('Last Name*').type(newLead.lastName)
      cy.findByLabelText('Phone Number*').type(newLead.phoneNumber)
      cy.findByRole('button', { name: 'Save' }).click()

      cy.get('table').should('contain', newLead.firstName)
      cy.get('table').should('contain', newLead.lastName)
      cy.get('table').should('contain', newLead.phoneNumber)

      cy.reload()

      cy.get('table').should('contain', newLead.firstName)
      cy.get('table').should('contain', newLead.lastName)
      cy.get('table').should('contain', newLead.phoneNumber)
    })
  })
})
