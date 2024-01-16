export {}

describe('Onboarding', () => {
  beforeEach(() => {
    cy.task('resetDBRails').then((r: any) => {
      cy.log(r['email'])
      cy.wrap(r).as('response')
    })
  })

  it('should navigate through onboarding', () => {
    // output debug in cypress
    cy.get('@response').then((r: any) => {
      cy.log(r)
      cy.log(r['email'])

      cy.visit('/')
      cy.get('div').contains('mock auth')

      // get select and filter on the one with an email regex
      cy.get('select')
        .filter((_, element) => {
          return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
        })
        .select(r['email'])
      cy.visit('/')
    })

    cy.get('input').filter('[placeholder="First name"]').type('Dwight')
    cy.get('input').filter('[placeholder="Last name"]').type('Schrute')
    cy.get('input').filter('[placeholder="Phone number"]').type('570-555-5555')
    cy.get('input').filter('[placeholder="MM/DD/YYYY"]').type('01/20/1970')
    cy.get('button').contains('Next').click()

    // experience
    cy.get('div').contains("I've had or currently have a job").click()
    cy.get('div').contains("I've attended a Training Program").click()
    cy.get('div').contains('I have a High School Diploma / GED').click()
    cy.get('div').contains("I have other experience I'd like to share").click()
    cy.get('button').contains('Next').click()

    // job experience
    cy.get('input').filter('[placeholder="i.e. Dunder Mifflin"]').type('Dunder Mifflin')
    cy.get('input')
      .filter('[placeholder="i.e. Assistant"]')
      .type('Assistant to the Regional Manager')
    cy.get('input').filter('[placeholder="MM/YYYY"]').first().type('03/2021')
    cy.get('input').filter('[placeholder="MM/YYYY"]').last().type('03/2023')
    cy.get('textarea').filter('[placeholder="Responsibilities, skills, etc."]').type('Paper')
    cy.get('button').contains('Next').click()

    // training
    cy.get('div').contains("Megan's Recruits").click()
    cy.get('button').contains('Next').click()

    // education
    cy.get('input')
      .filter('[placeholder="i.e. Washington High School"]')
      .type('Scranton High School')
    cy.get('input').filter('[placeholder="i.e. High School Student"]').type('Student')
    cy.get('input').filter('[placeholder="YYYY"]').type('2014')
    cy.get('input').filter('[placeholder="3.6/4.0"]').type('2.9')
    cy.get('input').filter('[placeholder="Teams, clubs, etc."]').type('Paper Club')
    cy.get('button').contains('Next').click()

    // personal experience
    cy.get('input')
      .filter('[placeholder="Babysitting, fixing bikes, cleaning"]')
      .type('Volunteer sheriff, beet farmer')
    cy.get('input').filter('[placeholder="2021"]').type('2001')
    cy.get('input').filter('[placeholder="2023"]').type('2010')
    cy.get('input').last().type('I learned to be a leader of my subordinates')
    cy.get('button').contains('Next').click()

    // opportunity interests
    cy.get('div').contains('Construction').click()
    cy.get('div').contains('Manufacturing').click()
    cy.get('div').contains('Healthcare').click()
    cy.get('button').contains('Next').click()
    cy.get('body').should('contain', 'Your future is bright! 🎉')

    const apply = cy.get('body').contains('Get Ready to Apply').parent()

    apply.should('contain', '1/2')

    const career = cy.get('body').contains('Start your career!').parent()

    career.should('contain', '0/2')

    // press escape to close modal
    cy.get('body').trigger('keydown', { keyCode: 27 })
    cy.wait(500)
    cy.get('body').trigger('keyup', { keyCode: 27 })

    cy.get('body').should('contain', 'Find your perfect job 💼')
    cy.get('body').should('contain', 'Construction')
    cy.get('body').should('contain', 'Manufacturing')
    cy.get('body').should('contain', 'Healthcare')

    const turner = cy.get('div').contains('Turner Construction Company').parent().parent().parent()
    turner.should('contain', 'Level 2 Mechanic')
    turner.should('contain', 'Columbus, OH')
    turner.should('contain', 'No experience needed')
    turner.should('contain', '$55k/year - $60k/year')
    turner.should('contain', 'Apply')
    turner.contains('Apply').click()

    cy.get('body').should('contain', "Let's do this")
    cy.get('button').contains('Apply with Blocktrain Profile').click()
    cy.get('button').contains('Back to Jobs').click()
    cy.get('div').contains('Turner Construction Company').click()

    // find button by aria label 'Options'
    cy.get('button').filter('[aria-label="Options"]').click()
    cy.get('a').contains('My Profile').click()

    cy.get('body').should('contain', 'Dwight Schrute')
    const experience = cy.get('div').contains('Experience').parent().parent()
    experience.should('contain', 'Dunder Mifflin')
    experience.should('contain', 'Assistant to the Regional Manager')
    experience.should('contain', '03/2021 - 03/2023')
    experience.should('contain', 'Paper')

    const education = cy.get('div').contains('Education').parent().parent()
    education.should('contain', 'Scranton High School')
    education.should('contain', '2014')
    education.should('contain', 'GPA: 2.9')
    education.should('contain', 'Paper Club')

    const personalExperience = cy.get('div').contains('Personal Experience').parent().parent()
    personalExperience.should('contain', 'Volunteer sheriff, beet farmer')
    personalExperience.should('contain', '2001 - 2010')
    personalExperience.should('contain', 'I learned to be a leader of my subordinates')

    const about = cy.get('div').contains('About').parent().parent()
    about.within(() => {
      cy.get('button').click()
    })
    cy.get('button').contains('Add another').click()
    cy.get('button').contains('What are you most passionate about?').click()
    cy.get('textarea').type('Beets')
    cy.get('button').contains('Save Changes').click()
    cy.get('body').should('contain', 'Dwight Schrute')
    cy.get('body').should('contain', 'What are you most passionate about?')
    cy.get('body').should('contain', 'Beets')
    cy.get('svg').first()
  })
})
