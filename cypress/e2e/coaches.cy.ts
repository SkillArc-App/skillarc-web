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
      cy.wrap(r['person']).as('person')
      cy.wrap(r['job']).as('job')
      cy.wrap(r['employer']).as('employer')
    })
    cy.task('createSeekerLead').then((r: any) => {
      cy.wrap(r).as('lead')
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
      cy.findByRole('tab', { name: 'Feed' }).click()

      cy.get('@job').then((job: any) => {
        cy.get('@employer').then((employer: any) => {
          cy.findByRole('table').within(() => {
            cy.findAllByText(`${person['email']}`)
              .parent()
              .next()
              .next()
              .then((rows) => {
                expect(rows).to.have.length(2)

                const expectedCopy: string[] = [
                  `${person['firstName']} ${person['lastName']} signed up.`,
                  `${person['firstName']} ${person['lastName']} applied for ${job['employmentTitle']} at ${employer['name']}.`,
                ]

                // Extract the text content of all buttons
                const rowCopy: string[] = []
                rows.each((_, row) => {
                  cy.log(row.innerText)
                  rowCopy.push(row.innerText)
                })

                // Assert that each expected text is found in the buttonTexts array
                expectedCopy.forEach((text) => {
                  expect(rowCopy).to.include(text)
                })
              })
          })
        })
      })

      cy.findByRole('tab', { name: 'Seekers' }).click()
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

      cy.findByRole('button', { name: 'recommend-for-job' }).click()
      cy.findByDisplayValue('Job Order').select('General Contractor - The Superior Group')
      cy.findByRole('button', { name: 'Recommend' }).click()

      cy.get('body').should('contain', person['email'])

      cy.findByRole('tab', { name: 'Job Statuses' }).click()

      let jobsTable = cy.findByRole('table')
      jobsTable.within(() => {
        const row = cy.findByText('Level 2 Mechanic').parent().parent()

        row.within(() => {
          cy.findByText('Recommend').click()
          cy.findByText('Recommended')
        })
      })

      cy.findByRole('tab', { name: 'Notes' }).click()

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

      cy.findByLabelText('Communication received').click()
      cy.findByLabelText('Email Communication').click()
      cy.findByText('Email received')

      const coachSelect = cy.contains('p', 'Assigned Coach').parent().find('select')
      coachSelect.select(coachEmail)
      coachSelect.find('option:selected').should('have.text', coachEmail)

      // save current route
      cy.url().then((url) => {
        cy.findByRole('link', { name: `${person['firstName']} ${person['lastName']}` }).click()
        cy.findByLabelText('Edit Profile').click()

        cy.get('p').contains('Phone number').next().clear().type('570-555-5555')
        cy.get('button').contains('Save').click()
        cy.visit(url)
      })

      reloadUntilConditionMet(
        () => {
          return cy
            .get('body')
            .contains('Phone Number')
            .next()
            .then((el) => el.text().includes('570-555-5555'))
        },
        { retryCount: 8 },
      )

      cy.findByRole('button', { name: 'certify' }).click()
      cy.findByRole('button', { name: 'certify' }).should('not.exist')

      const now = new Date()
      const pad = (x: number) => x.toString().padStart(2, '0')

      const dateString = `${now.getFullYear()}-${pad(now.getMonth() + 2)}-01`

      cy.findByRole('button', { name: 'create-reminder' }).click()
      cy.findByLabelText('Reminder Time*').type(`${dateString}T09:00`)
      cy.findByLabelText('Reminder Note*').type("Let's reach back out to this seeker in a few days")
      cy.findByRole('button', { name: 'Save' }).click()

      cy.findByRole('tab', { name: 'Tasks' }).click()

      cy.findByRole('button', { name: 'New Reminder' }).click()
      cy.findByLabelText('Reminder Time*').type(`${dateString}T11:00`)
      cy.findByLabelText('Reminder Note*').type('Give yourself a high five')
      cy.findByRole('button', { name: 'Save' }).click()

      let taskTable = cy.findByRole('table')
      taskTable.within(() => {
        const row = cy
          .findByText("Let's reach back out to this seeker in a few days")
          .parent()
          .parent()

        row.within(() => {
          cy.findByText('Jump to Seeker').click()
        })
      })

      cy.findByRole('tab', { name: 'Seeker Tasks' }).should('have.attr', 'aria-selected', 'true')
      cy.findByText("Let's reach back out to this seeker in a few days")
      cy.go('back')

      taskTable = cy.findByRole('table')
      taskTable.within(() => {
        const row = cy
          .findByText("Let's reach back out to this seeker in a few days")
          .parent()
          .parent()

        row.within(() => {
          cy.findByLabelText('Complete Task').click()
        })
      })

      cy.get('body').should('not.contain', "Let's reach back out to this seeker in a few days")

      cy.findByRole('tab', { name: 'Seekers' }).click()

      const table = cy.findByRole('table')
      table.within(() => {
        const row = cy.findByText(`${person['firstName']} ${person['lastName']}`).parent().parent()

        row.within(() => {
          cy.findAllByText(coachEmail).should((elements) => expect(elements).to.have.length(1))
          cy.findByRole('link', { name: 'Dash' }).click()
        })
      })

      cy.findByText('< Back to Seekers')

      cy.get('body').should('contain', 'This is a new note')
      cy.get('button[aria-label="Delete Note"]').click()
      cy.get('body').should('not.contain', 'This is a new note')

      cy.findByRole('tab', { name: 'Job Statuses' }).click()

      jobsTable = cy.findByRole('table')
      jobsTable.within(() => {
        cy.findByText('Level 2 Mechanic').click()
      })

      cy.url().should('contain', '/jobs/')
      cy.go('back')

      cy.findByRole('tab', { name: 'Resumes' }).click()

      cy.findByRole('button', { name: 'Create New Resume' }).click()
      cy.get('div').contains('Anonymize Resume?').click()
      cy.get('div').contains('Background Check Cleared?').click()
      cy.findByRole('button', { name: 'Save' }).click()
      cy.findByText('succeeded')
      cy.findByRole('button', { name: 'Download' }).click()
      cy.readFile('cypress/downloads/resume.pdf')

      cy.findByRole('link', { name: `${person['firstName']} ${person['lastName']}` }).click()
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
      cy.findByRole('tab', { name: 'Seekers' }).click()
      cy.url().should('contain', '/coaches/seekers')

      cy.findByRole('tab', { name: 'Seekers' }).should('have.attr', 'aria-selected', 'true')

      cy.get('table').should('not.contain', lead['firstName'])

      cy.get('label').contains('Owned by Me').parent().click()

      cy.get('table').should('contain', lead['firstName'])
      cy.get('table').should('contain', lead['lastName'])

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

      reloadUntilConditionMet(
        () => {
          return cy
            .get('table')
            .then((el) => el.text().includes(`${newLead.firstName} ${newLead.lastName}`))
        },
        { retryCount: 8 },
      )

      cy.get('table').should('contain', newLead.firstName)
      cy.get('table').should('contain', newLead.lastName)

      cy.findByRole('table').within(() => {
        const row = cy.findByText(`${newLead.firstName} ${newLead.lastName}`).parent().parent()

        row.within(() => {
          cy.findByRole('link', { name: 'Dash' }).click()
        })
      })

      cy.findByText('< Back to Seekers')

      cy.findByRole('button', { name: 'certify' }).should('be.enabled')

      cy.findByPlaceholderText('Add a note').type('This is a note').type('{enter}')
      cy.findByPlaceholderText('Add a note').should('have.value', '')

      cy.findByText('< Back to Seekers').click()
      cy.findByRole('tab', { name: 'Seekers' }).should('have.attr', 'aria-selected', 'true')
    })
  })
})
