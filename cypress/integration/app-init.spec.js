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
      .should('have.text', 'Oh no!')
      .and('contain', 'Oh no!')
    })

it('Test cookie logged in console', () => {
    Cypress.Cookies.debug(true)

    // Cypress will now log in the console when
    // cookies are set or cleared
    cy.setCookie('fakeCookie', '123ABC')
    cy.clearCookie('fakeCookie')
  })

it('check select ranking json', () => {
  cy.fixture('ranking1').should((ranking1) => {
    expect(ranking1[0].NAME).to.exist
    expect(ranking1).to.be.an('array')
    expect(ranking1[0].NAME).to.eq('player1')
    })
  })

// it('check global ranking json', () => {
//   cy.server()
//   cy.fixture('globalRankings.json').as('globalRankings')
//   cy.route('GET', 'comments/*', '@globalRankings').as('getglobalRankings')
//
// cy.wait('@getglobalRankings').its('responseBody')
//   .should('have.property', 'RANKINGNAME')
//   .and('include', 'testRank1')
//   })

})
