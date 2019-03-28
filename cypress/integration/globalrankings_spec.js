describe('GlobalRankings Display', () => {
  it('Loads ranking json on page load', () => {
      cy.GlobalSeed()

      cy.get('.bstable')
      .should('be.visible')

      cy.get('.bstable').find('tr').should('have.length', 6)

      cy.get('.error')
      .should('not.be.visible')
    })
})
