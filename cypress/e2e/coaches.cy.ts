export {}

describe('Coaches', () => {
  beforeEach(() => {
    cy.task('createCoach').then((r: any) => {
      cy.log(r['email'])
      cy.wrap(r).as('coach')
    })
    cy.task('createActiveSeeker').then((r: any) => {
      cy.log(r['email'])
      cy.wrap(r).as('seeker')
    })
  })

  it('should navigate through coaches dashboard', () => {
    cy.visit('/coaches')

    let coachEmail = ''

    cy.get('@coach').then((r: any) => {
      cy.get('div').contains('mock auth')
      coachEmail = r['email']
      cy.get('select')
        .filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        .select(coachEmail)
    })

    cy.get('@seeker').then((r: any) => {
      cy.get('a').contains(r['email']).click()

      cy.get('body').should('contain', `${r['first_name']} ${r['last_name']}`)
      cy.get('body').should('contain', r['email'])
      cy.get('body').should('contain', 'Beginner')

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

      cy.get('a').contains('< Back to Seekers').click()

      cy.get('body').should('contain', `${r['first_name']}`)
      cy.get('body').should('contain', `${r['last_name']}`)

      cy.get('h1').contains('Seekers')

      cy.get('a').contains(r['email']).click()

      const reloadUntilTextAppears = (retries = 5) => {
        cy.get('body').contains(r['first_name'])
        cy.get('body').then(($body) => {
          cy.log($body.text())
          if ($body.text().includes('This is a new note')) {
          } else {
            if (retries === 0) return

            cy.reload().then(() => {
              reloadUntilTextAppears(retries - 1)
            })
          }
        })
      }
      reloadUntilTextAppears()

      cy.get('body').should('contain', 'This is a new note')
      cy.get('button[aria-label="Delete Note"]').click()
      cy.get('body').should('not.contain', 'This is a new note')

      cy.get('a').contains('Jump to Profile').click()
      cy.get('button').filter('[aria-label="Edit Profile"]').click()

      cy.get('p').contains('First name').next().clear().type('Dwight')
      cy.get('p').contains('Last name').next().clear().type('Schrute')
      cy.get('p').contains('ZIP Code').next().clear().type('18503')
      cy.get('p').contains('Phone number').next().clear().type('570-555-5555')

      cy.get('button').contains('Save').click()

      cy.get('body').contains('Dwight Schrute')
      cy.get('body').contains('18503')
      cy.get('body').contains('570-555-5555')
    })
  })
})
