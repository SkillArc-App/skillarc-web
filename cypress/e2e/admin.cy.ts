export {}

describe('Admin', () => {
  it('should navigate through admin tasks', () => {
    cy.visit('/admin/attributes')

    const emailSelect = cy.get('select').filter((_, element) => {
      return !!element.innerText.match(/.*@[a-zA-z].[a-z]/)
    })
    emailSelect.should('be.enabled')
    emailSelect.select('admin@blocktrainapp.com', { timeout: 10000 })
    cy.reload()
    cy.get('body').should('contain', 'Operations')
    cy.get('body').should('contain', 'Analytics')

    const name = crypto.randomUUID()

    cy.get('button').contains('+ New Attribute').click()
    cy.get('label').contains('Name').next().type(name)
    cy.get('label').contains('Set (newline separated)').next().type('Test1\nTest2')
    cy.get('label').contains('Default (newline separated)').next().type('Test1')
    cy.get('button').contains('Save').click()

    cy.get('body').should('not.contain', 'Save')
    cy.get('body').should('contain', 'Test1, Test2')

    cy.findByRole('table').within(() => {
      const row = cy.findByText(name).parent().parent()

      row.within(() => {
        cy.findByLabelText('delete-attribute').click()
      })
    })

    cy.get('body').should('not.contain', name)

    cy.visit('/admin/jobs')

    cy.get('button').contains('+ New Job').click()

    cy.get('body').contains('New Job').should('be.visible')

    cy.get('div').contains('Staffing').click()
    cy.findByDisplayValue('Employer').select('Turner Construction Company')
    const title = crypto.randomUUID()

    cy.findByPlaceholderText('Employment Title').type(title)
    cy.findByPlaceholderText('Location').type('Columbus, OH')
    cy.findByDisplayValue('Employment Type').select('FULLTIME')
    cy.findByPlaceholderText('Benefits Description').type('Great benefits')
    cy.findByPlaceholderText('Responsibilities Description').type('Great responsibilities')
    cy.findByPlaceholderText('Requirements Description').type('Great requirements')
    cy.findByPlaceholderText('Work days').type('Monday - Friday')
    cy.findByPlaceholderText('Schedule').type('9am - 5pm')
    cy.findByText('Save').click()

    cy.findByRole('link', { name: title }).click()

    // Add an attribute
    cy.findByRole('tab', { name: 'Attributes' }).click()
    cy.findByRole('button', { name: '+ New Job Attribute' }).click()
    cy.findByDisplayValue('Attribute').select('Background')
    cy.findByLabelText('Acceptible Set (newline separated)*').type('Misdemeanor\n')
    cy.findByRole('button', { name: 'Save' }).click()
    cy.findByText('Misdemeanor')
    cy.findByText('Background')

    // Add an industry
    cy.findByRole('tab', { name: 'Industries' }).click()
    cy.findByLabelText('Add New Industries').select('healthcare')
    cy.findByText('healthcare')

    // Skills
    cy.findByRole('tab', { name: 'Attached Skills' }).click()
    cy.findByLabelText('Add New Desired Skills').select('Creativity')
    cy.get('td').contains('Creativity')

    cy.findByLabelText('Add New Learned Skills').select('Leadership')
    cy.get('td').contains('Leadership')

    // Certifications
    // For some reason I can get it to pick these certification
    // cy.findByRole('tab', { name: 'Attached Certifications' }).click()
    // cy.findByLabelText('Add New Desired Skills').select('OSHA 10')
    // cy.get('td').contains('OSHA 10')

    // Testimonials
    cy.findByRole('tab', { name: 'Testimonials' }).click()
    cy.findByPlaceholderText('Name').type('John Doe')
    cy.findByPlaceholderText('Job Title').type('Mr. CEO')
    cy.findByPlaceholderText('Testimonial').type('This Place is cool!')
    cy.findByPlaceholderText('Photo URL').type(
      'https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg',
    )
    cy.findByRole('button', { name: 'Create' }).click()

    cy.findByText('John Doe')
    cy.findByText('Mr. CEO')
    cy.findByText('This Place is cool!')
    cy.findByText('https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg')

    // Photos
    cy.findByRole('tab', { name: 'Photos' }).click()
    cy.findByPlaceholderText('URL').type(
      'https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg',
    )
    cy.findByRole('button', { name: 'Create' }).click()
    cy.findByText('https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg')

    // Career Path
    cy.findByRole('tab', { name: 'Career Path' }).click()

    cy.findByPlaceholderText('Title').type('Entry Level')
    cy.findByPlaceholderText('Lower limit').type('17')
    cy.findByPlaceholderText('Upper limit').type('23')
    cy.findByRole('button', { name: 'Create' }).click()

    cy.findByText('Entry Level')
    cy.findByText('17')
    cy.findByText('23')

    // Career Path
    cy.findByRole('tab', { name: 'Tags' }).click()
    cy.findByLabelText('Add A New Tag').select('Part time only')
    cy.findByText('Part time only')
  })
})
