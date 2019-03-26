describe('App Initialization', () => {
  it.only('Loads ranking json on page load', () => {
    //use the Cyrpess commands.js file to handle json loading
      cy.SeedandVisitGlobal()
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
      //cy.get('.bstable').find('tr').should('have.length', 7)
      //cy.get('ul>li').not('.active').should('have.length', 4) // true
      //expect($lis, '3 items').to.have.length(2)
      //cy.get('input').should('not.have.value', 'Jane')
      cy.get('.error')
      .should('be.visible')
    })
  })
