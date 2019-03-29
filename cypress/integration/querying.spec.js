/// <reference types="Cypress" />

context('Querying', () => {
  beforeEach(() => {
    //cy.visit('https://example.cypress.io/commands/querying')
    cy.GlobalSeed()
  })

  // The most commonly used query is 'cy.get()', you can
  // think of this like the '$' in jQuery

  it('cy.get() - query DOM elements', () => {
    // https://on.cypress.io/get

    //cy.get('#query-btn').should('contain', 'Button')
    cy.get('[tabindex="4"] > button').should('contain', 'View')

    // cy.get('.query-btn').should('contain', 'Button')
    //
    // cy.get('#querying .well>button:first').should('contain', 'Button')
    // //              ↲
    // // Use CSS selectors just like jQuery
    //
    // cy.get('[data-test-id="test-example"]').should('have.class', 'example')
  })

  it('cy.contains() - query DOM elements with matching content', () => {
    // https://on.cypress.io/contains
    cy.get('.bstable')
      .contains('mplayer1ra')
      .should('have.class', '')

    // we can pass a regexp to `.contains()`
    // cy.get('.query-list')
    //   .contains(/^b\w+/)
    //   .should('have.class', 'third')
    //
    // cy.get('.query-list')
    //   .contains('apples')
    //   .should('have.class', 'first')
    //
    // // passing a selector to contains will
    // // yield the selector containing the text
    // cy.get('#querying')
    //   .contains('ul', 'oranges')
    //   .should('have.class', 'query-list')
    //
    // cy.get('.query-button')
    //   .contains('Save Form')
    //   .should('have.class', 'btn')
  })

  it('.within() - query DOM elements within a specific element', () => {
    // https://on.cypress.io/within
    cy.get('.bstable').within(() => {
      cy.get('input:first').should('have.attr', 'placeholder', 'Enter Ranking Name (Filter)...')
      //cy.get('input:last').should('have.attr', 'placeholder', 'Password')
    })
  })

  it.only('cy.root() - query the root DOM element', () => {
    // https://on.cypress.io/root
//cy.get('#root > :nth-child(1)')
    // By default, root is the document
    cy.root().should('match', 'html')
    cy.get('#root > :nth-child(1)').within(() => {
    //cy.get('.query-ul').within(() => {
      // In this within, the root is now the ul DOM element
      //cy.root().should('have.class', 'query-ul')
      cy.root().should('have.class', '')
    })
  })
})
