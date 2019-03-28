describe('App Initialization', () => {
    it('Displays an error msg on error', () => {
      cy.server()
      cy.route({
        url:'/',
        method: 'GET',
        status: 500,
        response: {}
      })
      cy.visit('/')
      cy.get('.error')
      .should('be.visible')
    })
  })
