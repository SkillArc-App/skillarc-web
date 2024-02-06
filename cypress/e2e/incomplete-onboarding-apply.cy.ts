export {}

describe('Incomplete Onboarding applying to jobs', () => {
  beforeEach(() => {
    cy.task('createUser').then((r: any) => {
      cy.wrap(r).as('user')
    })
    cy.task('createJob').then((r: any) => {
      cy.wrap(r).as('job')
    })
  })

  const minimalOnboardingAndJobApply = (job: any) => {
    cy.url().should('contain', 'onboarding')

    cy.findByPlaceholderText('First name').type('John')
    cy.findByPlaceholderText('Last name').type('Brauns')
    cy.findByPlaceholderText('Phone number').type('222-333-4444')
    cy.findByPlaceholderText('MM/DD/YYYY').type('01/20/1970')
    cy.findByRole('button', { name: 'Next' }).click()

    cy.get('div').contains("I've had or currently have a job").click()
    cy.findByRole('button', { name: 'Next' }).click()

    cy.findByPlaceholderText('i.e. Dunder Mifflin').type('Dunder Mifflin')
    cy.findByPlaceholderText('i.e. Assistant').type('Assistant to the Regional Manager')
    cy.get('input').filter('[placeholder="MM/YYYY"]').first().type('03/2021')
    cy.get('input').filter('[placeholder="MM/YYYY"]').last().type('03/2023')
    cy.findByPlaceholderText('Responsibilities, skills, etc.').type('Paper')
    cy.findByRole('button', { name: 'Next' }).click()

    cy.get('div').contains('Construction').click()
    cy.findByRole('button', { name: 'Next' }).click()

    cy.url().should('contain', job.id)

    cy.findByRole('button', { name:'Apply With Your SkillArc Profile' }).click()
    cy.findByText(job.employmentTitle)

    // in modal
    const applyModal = cy.findByText('Would you like to apply to').parent().parent()

    applyModal.within(() => {
      cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()
    })

    const congratsModal = cy.findByText(`Great work, John 🎉`).parent().parent()
    congratsModal.within(() => {
      cy.findByText('Update your profile').click()
    })

    // find button by aria label 'Options' and click my profile
    cy.get('button').filter('[aria-label="Options"]').click()
    cy.findByText('Manage My Jobs').click()

    cy.findByText('Applied').click()

    // Because of tabs there are multiple version on the DOM
    cy.get('body').should('contain', job.employmentTitle)
  }

  it('When applying from /jobs', () => {
    cy.get('@user').then((user: any) => {
      cy.log(user)

      cy.get('@job').then((job: any) => {
        cy.log(job)

        cy.visit('/jobs')

        // get select and filter on the one with an email regex
        const emailSelect = cy.get('select').filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        emailSelect.should('be.enabled')
        emailSelect.select(user['email'], { timeout: 10000 })

        const card = cy.findByRole('listitem', { name: job['employmentTitle'] })
        card.within(() => {
          cy.findByRole('button', { name: 'Apply' }).click()
        })

        cy.findByRole('button', { name: 'Apply by Completing Your SkillArc Profile' }).click()

        minimalOnboardingAndJobApply(job)
      })
    })
  })

  it('When applying from /my_jobs', () => {
    cy.get('@user').then((user: any) => {
      cy.log(user)

      cy.get('@job').then((job: any) => {
        cy.log(job)

        cy.visit('/jobs')

        // get select and filter on the one with an email regex
        const emailSelect = cy.get('select').filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        emailSelect.should('be.enabled')
        emailSelect.select(user['email'], { timeout: 10000 })

        cy.visit(`/my_jobs`)

        const card = cy.findByRole('listitem', { name: job['employmentTitle'] })
        card.within(() => {
          cy.findByRole('button', { name: 'Apply' }).click()
        })

        cy.findByRole('button', { name: 'Apply by Completing Your SkillArc Profile' }).click()

        minimalOnboardingAndJobApply(job)
      })
    })
  })

  it('When applying from /jobs/<jobId>', () => {
    cy.get('@user').then((user: any) => {
      cy.get('@job').then((job: any) => {
        cy.visit('/jobs')

        // get select and filter on the one with an email regex
        const emailSelect = cy.get('select').filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        emailSelect.should('be.enabled')
        emailSelect.select(user['email'], { timeout: 10000 })

        cy.visit(`/jobs/${job.id}`)
        cy.findByRole('button', { name: 'Apply by Completing Your SkillArc Profile' }).click()

        minimalOnboardingAndJobApply(job)
      })
    })
  })
})
