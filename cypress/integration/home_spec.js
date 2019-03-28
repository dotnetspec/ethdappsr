describe('Home Component', () => {
    it('View btn click Home route', () => {
        cy.RankingSeedViaGlobalViewBtn()
        cy.get('tbody').find('tr').should('have.length', 5)
      })
  })
