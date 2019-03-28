describe('Routing', () => {
    it('View btn click Home route', () => {
        cy.RankingSeedViaGlobalViewBtn()
        cy.url()
        .should('include', '/home/@player1')
      })
  })
