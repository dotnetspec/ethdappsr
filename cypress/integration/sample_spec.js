describe("My first test", function(){

  it('Makes an assertion ', function(){

    //cy.visit('https://dotnetspec.github.io/sportrank/')
        cy.visit('http://localhost:8000')
        cy.pause()
    cy.contains('Update Profile').click()

    cy.url()
    .should('include', '/update/@player1')

    cy.get('.contactno')
    .type('123456789012345')
    .should('have.value', '123456789012345')
  })
})
