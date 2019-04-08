Cypress.Commands.add('GlobalSeed', () => {
  cy.server()
  cy.route('GET', '/', 'fixture:globalRankings')
  cy.visit('/')
})

Cypress.Commands.add('InitializeServerAndRoutes', () => {
  cy.server()
  //cy.route('GET', 'https://unpkg.com/unfetch/dist/unfetch.umd.js', 'fixture:polyfill')
  cy.route('GET', 'https://api.jsonbin.io/b/5c36f5422c87fa27306acb52/latest', 'fixture:globalRankings').as('globalRankings')
  cy.route('GET', 'https://api.jsonbin.io/b/5c875c79adeb832d3ec6732d/latest', 'fixture:ranking1')
  //.as('globalRankings')
  cy.route('POST', 'http://localhost:5001/api/v0/id?stream-channels=true', 'fixture:ipfs')
  cy.route('GET', '/manifest.json', 'fixture:manifest')
  cy.route('GET', '/', 'fixture:globalRankings')
  cy.route('GET', 'http://localhost:8000/home/@player1', 'fixture:ranking1')
})

Cypress.Commands.add('SeedRanking', () => {
  cy.server()
  //NB: don't use /home/@player1 in the route here
  //it will interfere with the data loading
  cy.route('GET', '/', 'fixture:ranking1')
  //currently 'visiting' has to be done via the
  //gloabranking page for usernames and routes to work
  //cy.visit('/home/@player1')
})

//get ready to visit a ranking via a page click (in the test spec)
Cypress.Commands.add('RankingSeedViaGlobalViewBtn', () => {
  cy.server()
  cy.route('GET', '/', 'fixture:globalRankings.json').as('globalRankingList')
  cy.visit('/')
  //cy.wait('@globalRankingList')
  //unless wait doesn't pick up player
  //cy.wait(1000)
  cy.get('tbody>tr>td').contains("View").as('firstViewBtn')
    cy.get('@firstViewBtn').click()
  //click to get to a particular ranking
  cy.route('GET', '/', 'fixture:ranking1')
})

Cypress.Commands.add('GlobalRankingWitCyStub', () => {
  cy.server()
  cy.route('GET', '/', 'fixture:globalRankings').as('globalRankingList')
cy.visit('/', {
  onBeforeLoad (win) {
    cy.stub(win, 'fetch')
    // .withArgs('/favorite-fruits')
    // .as('fetchFavorites')
    // .returns(this.fetchFavoritesDeferred.promise)
    },
  })
  // cy.wait(2000)
  // cy.route('GET', '/home/@player1', 'fixture:ranking1')
  // cy.visit('/home/@player1', {
  //   onBeforeLoad (win) {
  //     cy.stub(win, 'fetch')
  //     },
  //   })
})


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
