describe('Home Component', () => {
    it('View btn click Home route', () => {
        cy.RankingSeedViaGlobalViewBtn()
        cy.wait(1000)
        cy.get('tbody').find('tr').should('have.length', 6)
      })
  })
