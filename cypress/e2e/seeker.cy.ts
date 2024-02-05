import { industries } from "@/common/static/industries"

export {}

describe('Seeker', () => {
  beforeEach(() => {
    cy.task('createSeeker').then((seeker: any) => {
      cy.wrap(seeker['seeker']).as('seeker')
      cy.wrap(seeker['user']).as('user')
    })
  })

  it('should navigate through onboarding', () => {
    // output debug in cypress
    cy.get('@user').then((user: any) => {
      cy.get('@seeker').then((seeker: any) => {
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

        cy.visit(`/profiles/${seeker['id']}`)

        // profile page
        cy.get('body').should('contain', user['firstName'])
        cy.get('body').should('contain', user['lastName'])

        cy.findByRole('button', { name: 'View Jobs' }).click()

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

        cy.get('body').should('contain', "Let's do this")
        cy.get('button').contains('Apply with SkillArc Profile').click()
        cy.get('button').contains('Back to Jobs').click()

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
        cy.findByRole('button', { name: 'Apply with SkillArc Profile' }).click()

        // in modal
        const applyModal = cy.findByText('Apply with SkillArc').parent().parent()

        applyModal.within(() => {
          cy.findByRole('button', { name: 'Apply with SkillArc Profile' }).click()
        })

        const congratsModal = cy
          .findByText(`Great work, ${user['firstName']} 🎉`)
          .parent()
          .parent()
        congratsModal.within(() => {
          cy.findByText('Update your profile').click()
        })

        // on the profile page again
        cy.findByRole('button', { name: 'View Jobs' }).click()

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
