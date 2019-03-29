/// <reference types="Cypress" />

context('Navigation', () => {
  beforeEach(() => {
    //cy.visit('https://example.cypress.io')
    // cy.get('.navbar-nav').contains('Commands').click()
    // cy.get('.dropdown-menu').contains('Navigation').click()
    cy.RankingSeedViaGlobalViewBtn()
  })

  it('cy.go() - go back or forward in the browser\'s history', () => {
    // https://on.cypress.io/go

    //cy.RankingSeedViaGlobalViewBtn()

    cy.location('pathname').should('include', 'player1')

    cy.go('back')
    cy.location('pathname').should('not.include', 'player1')

    cy.go('forward')
    cy.location('pathname').should('include', 'player1')

    // clicking back
    cy.go(-1)
    cy.location('pathname').should('not.include', 'player1')

    // clicking forward
    cy.go(1)
    cy.location('pathname').should('include', 'player1')
  })

  it('cy.reload() - reload the page', () => {
    // https://on.cypress.io/reload
    cy.reload()

    // reload the page without using the cache
    cy.reload(true)
  })

  // it.only('cy.visit() - visit a remote url', () => {
  //   // https://on.cypress.io/visit
  //
  //   // Visit any sub-domain of your current domain
  //
  //   // Pass options to the visit
  //   cy.visit('https://example.cypress.io/commands/navigation', {
  //     timeout: 50000, // increase total time for the visit to resolve
  //     onBeforeLoad (contentWindow) {
  //       // contentWindow is the remote page's window object
  //       expect(typeof contentWindow === 'object').to.be.true
  //     },
  //     onLoad (contentWindow) {
  //       // contentWindow is the remote page's window object
  //       expect(typeof contentWindow === 'object').to.be.true
  //     },
  //   })
  //   })
})
