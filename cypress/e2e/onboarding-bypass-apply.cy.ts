export {}

describe('Incomplete Onboarding applying to jobs', () => {
  beforeEach(() => {
    cy.task('createUser').then((r: any) => {
      cy.wrap(r).as('user')
    })
    cy.task('createJob').then((r: any) => {
      cy.wrap(r['job']).as('job')
    })
    cy.task('assertNoFailedJobs')
  })

  function getNumbers(length: number) {
    let str = ''

    for (let i = 0; i < length; i++) {
      str += getRandomNumber()
    }

    return str
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * 10)
  }

  it('Allows you to bypass onboarding', () => {
    cy.get('@user').then((user: any) => {
      cy.log(user)

      cy.get('@job').then((job: any) => {
        cy.log(job)

        cy.visit('/jobs')

        cy.findByLabelText('Mock Auth Enabled').select(user['email'], { timeout: 10000 })

        const card = cy.findByRole('listitem', { name: job['employmentTitle'] })
        card.within(() => {
          cy.findByRole('button', { name: 'Apply' }).click()
        })

        cy.findByRole('button', { name: 'Apply by Completing Your SkillArc Profile' }).click()

        cy.url().should('contain', 'onboarding')

        cy.get('label').contains('First Name').next().type('John')
        cy.get('label').contains('Last Name').next().type('Brauns')
        const phoneNumber = `${getNumbers(3)}-${getNumbers(3)}-${getNumbers(4)}`
        cy.get('label').contains('Phone Number').next().type(phoneNumber)
        cy.get('label').contains('Date of Birth').next().type('1970-01-20')
        cy.findByRole('button', { name: 'Next' }).click()

        cy.get('div').contains("I've had or currently have a job").click()
        cy.findByRole('button', { name: 'Next' }).click()

        cy.findByLabelText('Company/Organization*').type('Dunder Mifflin')
        cy.findByLabelText('Position*').type('Assistant to the Regional Manager')
        cy.findByText('Finish your profile later').click()

        cy.url().should('contain', job.id)

        cy.findByRole('button', { name: 'Apply With Your SkillArc Profile' }).click()
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
      })
    })
  })
})
