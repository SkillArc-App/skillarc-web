export {}

describe('Onboarding', () => {
  beforeEach(() => {
    cy.task('createUser').then((r: any) => {
      cy.log(r['email'])
      cy.wrap(r).as('user')
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

  it('should navigate through onboarding', () => {
    // output debug in cypress
    cy.get('@user').then((user: any) => {
      cy.log(user)
      cy.log(user['email'])

      cy.visit('/')
      cy.findByLabelText('Mock Auth Enabled').select(user['email'], { timeout: 10000 })
    })

    cy.visit('/onboarding/start')
    cy.findByLabelText('First Name*').type('Dwight')
    cy.findByLabelText('Last Name*').type('Schrute')
    const phoneNumber = `${getNumbers(3)}-${getNumbers(3)}-${getNumbers(4)}`

    cy.findByLabelText('Phone Number*').type(phoneNumber)
    cy.findByLabelText('Date of Birth*').type('1970-01-20')
    cy.findByRole('button', { name: 'Next' }).click()

    // experience
    cy.get('div').contains("I've had or currently have a job").click()
    cy.get('div').contains("I've attended a Training Program").click()
    cy.get('div').contains('I have a High School Diploma / GED').click()
    cy.findByRole('button', { name: 'Next' }).click()

    // job experience
    cy.findByLabelText('Company/Organization*').type('Dunder Mifflin')
    cy.findByLabelText('Position*').type('Assistant to the Regional Manager')
    cy.findByLabelText('Start Date*').type('2021-03')
    cy.findByLabelText('End Date').type('2023-03')
    cy.findByLabelText('Description*').type('Paper')
    cy.findByRole('button', { name: 'Next' }).click()

    // training
    cy.get('div').contains("Megan's Recruits").click()
    cy.findByRole('button', { name: 'Next' }).click()

    // education
    cy.findByLabelText('School/Organization*').type('Scranton High School')
    cy.findByLabelText('Title').type('High School Student')
    cy.findByLabelText('Graduation Year / Expected Graduation Year*').type('2014')
    cy.findByLabelText('GPA').type('2.9')
    cy.findByLabelText('Activities').type('Paper Club')
    cy.findByRole('button', { name: 'Next' }).click()

    // opportunity interests
    cy.get('div').contains('Construction').click()
    cy.get('div').contains('Manufacturing').click()
    cy.get('div').contains('Healthcare').click()
    cy.findByRole('button', { name: 'Next' }).click()
    // cy.get('body').should('contain', 'Your future is bright! 🎉')

    // confirm we're on the jobs page
    cy.findByRole('link', { name: 'View Jobs' }).click()
    cy.findByText('Find your perfect job 💼')

    // find button by aria label 'Options' and click my profile
    cy.get('button').filter('[aria-label="Options"]').click()
    cy.get('a').contains('My Profile').click()

    cy.get('body').should('contain', 'Dwight Schrute')
    const experience = cy.get('div').contains('Experience').parent().parent()
    experience.should('contain', 'Dunder Mifflin')
    experience.should('contain', 'Assistant to the Regional Manager')
    experience.should('contain', '2021-03 - 2023-03')
    experience.should('contain', 'Paper')

    const education = cy.get('div').contains('Education').parent().parent()
    education.should('contain', 'Scranton High School')
    education.should('contain', '2014')
    education.should('contain', 'GPA: 2.9')
    education.should('contain', 'Paper Club')

    cy.findByLabelText('Edit Profile').click()

    const firstNameInput = cy.get('p').contains('First name').next()
    firstNameInput.should('have.value', 'Dwight')

    const lastNameInput = cy.get('p').contains('Last name').next()
    lastNameInput.should('have.value', 'Schrute')

    const zipCodeInput = cy.get('p').contains('ZIP Code').next()
    zipCodeInput.should('have.value', '')

    const phoneInput = cy.get('p').contains('Phone number').next()
    phoneInput.should('have.value', phoneNumber)

    firstNameInput.clear().type('Michael')
    lastNameInput.clear().type('Scott')
    zipCodeInput.clear().type('18503')
    phoneInput.clear().type('570-444-4444')

    cy.get('button').contains('Save Changes').click()

    cy.get('body').should('not.contain', 'Dwight Schrute')
    cy.get('body').should('contain', 'Michael Scott')
    cy.get('body').should('not.contain', phoneNumber)
    cy.get('body').should('contain', '570-444-4444')
    cy.get('body').should('contain', '18503')

    const about = cy.get('div').contains('About').parent().parent()
    about.within(() => {
      cy.findByRole('link').click()
    })
    cy.get('button').contains('Add another').click()
    cy.get('button').contains('What are you most passionate about?').click()
    cy.get('textarea').type('Beets')
    cy.get('button').contains('Save Changes').click()
    cy.get('body').should('contain', 'Michael Scott')
    cy.get('body').should('contain', 'What are you most passionate about?')
    cy.get('body').should('contain', 'Beets')
    cy.get('svg').first()
  })
})
