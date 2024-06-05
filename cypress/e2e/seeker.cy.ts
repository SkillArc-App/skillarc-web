export {}

describe('Seeker', () => {
  beforeEach(() => {
    cy.task('createSeeker').then((seeker: any) => {
      cy.wrap(seeker['person']).as('person')
      cy.wrap(seeker['user']).as('user')
    })
    cy.task('assertNoFailedJobs')
  })

  it('should navigate through onboarding', () => {
    // output debug in cypress
    cy.get('@user').then((user: any) => {
      cy.get('@person').then((person: any) => {
        cy.log(user)
        cy.log(user['email'])

        cy.visit('/')
        cy.get('div').contains('mock auth')

        // get select and filter on the one with an email regex
        const emailSelect = cy.get('select').filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        emailSelect.should('be.enabled')
        emailSelect.select(user['email'], { timeout: 10000 })

        cy.visit(`/profiles/${person['id']}`)

        // profile page
        cy.get('body').should('contain', user['firstName'])
        cy.get('body').should('contain', user['lastName'])

        cy.findByRole('link', { name: 'View Jobs' }).click()

        cy.get('body').should('contain', 'Find your perfect job 💼')

        // apply on jobs page
        const turner = cy.findByRole('listitem', { name: 'Level 2 Mechanic' })
        turner.should('contain', 'Level 2 Mechanic')
        turner.should('contain', 'Turner Construction Company')
        turner.should('contain', 'Columbus, OH')
        turner.should('contain', 'No experience needed')
        turner.should('contain', '$55k - $60k salary')
        turner.should('contain', 'Apply')
        turner.contains('Apply').click()

        const applyModal = cy.findByRole('dialog', { name: "Let's do this!" })

        applyModal.within(() => {
          cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()
        })

        const sharingModal = cy.findByRole('dialog', { name: `Great work, ${user.firstName}! 🎉` })
        sharingModal.within(() => {
          cy.findByRole('button', { name: 'Back to Jobs' }).click()
        })

        cy.findByRole('button', { name: 'Add an Elevator Pitch' }).click()
        cy.findByRole('dialog', { name: 'Elevator Pitch' }).within(() => {
          cy.findByRole('textbox').type('I am a mechanic')
          cy.findByRole('button', { name: "Let's Go!" }).click()
        })
        cy.get('body').should('contain', 'Update an Elevator Pitch')
        cy.get('body').should('contain', 'Pitch: I am a mechanic')

        // apply on individual job page
        const earthworkJourneyman = cy.findByRole('listitem', { name: 'Earthwork Journeyman' })
        earthworkJourneyman.should('contain', 'Earthwork Journeyman')
        earthworkJourneyman.should('contain', 'The Superior Group')
        earthworkJourneyman.should('contain', 'Dublin, OH')
        earthworkJourneyman.click()

        cy.get('body', { timeout: 10000 }).should('contain', 'Earthwork Journeymans')
        earthworkJourneyman.should('contain', 'Earthwork Journeymans')
        earthworkJourneyman.should('contain', 'The Superior Group')
        earthworkJourneyman.should('contain', 'Dublin, OH')

        // on page
        cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()

        // in modal
        const onPageApplyModal = cy.findByText('Would you like to apply to').parent().parent()

        onPageApplyModal.within(() => {
          cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()
        })

        const congratsModal = cy.findByText(`Great work, ${user['firstName']} 🎉`).parent().parent()
        congratsModal.within(() => {
          cy.findByText('Update your profile').click()
        })

        // on the profile page again
        cy.findByRole('link', { name: 'View Jobs' }).click()

        cy.get('body').should('contain', 'Find your perfect job 💼')

        cy.findByRole('search').type('Not a real job posting!')

        cy.get('body').should('not.contain', 'Level 2 Mechanic')
        cy.get('body').should('not.contain', 'Earthwork Journeyman')
        cy.get('body').should('not.contain', 'General Contractor')

        cy.findByRole('search').clear().type('Mechanic')

        cy.get('body').should('contain', 'Level 2 Mechanic')
        cy.get('body').should('not.contain', 'Earthwork Journeyman')
        cy.get('body').should('not.contain', 'General Contractor')

        cy.findByRole('search').clear()
        cy.get('label').contains('Industries').next().type(`Healthcare{Enter}`)

        cy.get('body').should('not.contain', 'Level 2 Mechanic')
        cy.get('body').should('not.contain', 'Earthwork Journeyman')
        cy.get('body').should('not.contain', 'General Contractor')

        cy.findByText('Healthcare').next().click()

        cy.get('label').contains('Tags').next().type(`No Experience Needed{Enter}`)

        cy.get('body').should('contain', 'Level 2 Mechanic')
        cy.get('body').should('not.contain', 'Earthwork Journeyman')
        cy.get('body').should('not.contain', 'General Contractor')
      })
    })
  })
})
