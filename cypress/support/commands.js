Cypress.Commands.add('SeedandVisitGlobal', () => {
  cy.server()
  cy.route('GET', '/', 'fixture:globalRankings')
  cy.visit('/')
})

Cypress.Commands.add('SeedandVisitRanking', () => {
  cy.server()
  //NB: don't use /home/@player1 in the route here
  //it will interfere with the data loading 
  cy.route('GET', '/', 'fixture:ranking1')
  //cy.visit('/home/@player1')
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
