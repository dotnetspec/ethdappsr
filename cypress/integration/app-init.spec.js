describe('App Initialization', () => {
  it.only('Loads ranking json on page load', () => {
      cy.server()
      //cy.route('GET', '/json/globalRankings', globalRankings)
      cy.route('GET', '/', 'fixture:globalRankings')
      cy.visit('/')

      cy.get('.bstable').find('tr').should('have.length', 6)
    })
  })
