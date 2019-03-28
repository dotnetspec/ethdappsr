describe('Click View Btn on GlobalRankings list ', () => {
  it('Initial value on global ranking json load', () => {
    //use the Cyrpess commands.js file to handle json loading
      cy.GlobalSeed()

      cy.get('.bstable').find('tr').should('have.length', 6)

      cy.get('.error')
      .should('not.be.visible')
    })

    it('View btn click Home route', () => {
        //use the Cyrpess commands.js file to handle json loading
        cy.RankingSeedViaGlobalViewBtn()
        //
        // cy.wait(1000)
        //
        // cy.get('tbody>tr>td').contains("View").click()

        cy.url()
        .should('include', '/home/@player1')
      })

    // it('Displays an error msg on error', () => {
    //   cy.server()
    //   cy.route({
    //     url:'/',
    //     method: 'GET',
    //     status: 500,
    //     response: {}
    //   })
    //   cy.visit('/')
    //   //cy.get('.bstable').find('tr').should('have.length', 7)
    //   //cy.get('ul>li').not('.active').should('have.length', 4) // true
    //   //expect($lis, '3 items').to.have.length(2)
    //   //cy.get('input').should('not.have.value', 'Jane')
    //   cy.get('.error')
    //   .should('be.visible')
    // })
  })
