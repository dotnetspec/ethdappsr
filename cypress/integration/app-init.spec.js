describe('App Initialization', () => {
  it.only('Loads ranking json on page load', () => {
    //use the Cyrpess commands.js file to handle json loading
      cy.GlobalSeed()
      cy.get('.bstable').find('tr').should('have.length', 6)

      cy.get('.error')
      .should('not.be.visible')
    })

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
