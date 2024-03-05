export {}

describe('Admin', () => {
  it('should navigate through admin tasks', () => {
    cy.visit('/admin/jobs')

    const emailSelect = cy.get('select').filter((_, element) => {
      return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
    })
    emailSelect.should('be.enabled')
    emailSelect.select('admin@blocktrainapp.com', { timeout: 10000 })

    cy.reload()

    cy.get('body').should('contain', 'Operations')
    cy.get('body').should('contain', 'Analytics')

    cy.get('button').contains('+ New Job').click()

    cy.get('body').contains('New Job').should('be.visible')

    cy.get('div').contains('Staffing').click()
    cy.findByDisplayValue('Employer').select('Turner Construction Company')
    cy.findByPlaceholderText('Employment Title').type(crypto.randomUUID())
    cy.findByPlaceholderText('Location').type('Columbus, OH')
    cy.findByDisplayValue('Employment Type').select('FULLTIME')
    cy.findByPlaceholderText('Benefits Description').type('Great benefits')
    cy.findByPlaceholderText('Responsibilities Description').type('Great responsibilities')
    cy.findByPlaceholderText('Requirements Description').type('Great requirements')
    cy.findByPlaceholderText('Work days').type('Monday - Friday')
    cy.findByPlaceholderText('Schedule').type('9am - 5pm')
    cy.findByText('Save').click()
  })
})
