
/// <reference types="Cypress" />

// Here, we remove window.fetch and polyfill it on top of XHRs.

// For most cases it is enough to just `delete window.fetch` because
// web code usually includes a polyfill for older browsers.
// But if the application code does not include a polyfill, our test
// code can load polyfill!
describe('polyfill window.fetch from tests', function () {
  let polyfill

  // grab fetch polyfill from remote URL, could be also from a local package
  before(() => {
    const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'
    cy.request(polyfillUrl)
    .then((response) => {
      polyfill = response.body
    })
  })

  beforeEach(function () {
    // all calls will be done via XHR after we load polyfill
    // so we can spy on them using cy.route
    cy.server()
    //cy.route('GET', '/', 'fixture:globalRankings.json').as('globalRankings')
    cy.route('GET', 'https://api.jsonbin.io/b/5c36f5422c87fa27306acb52/latest', 'fixture:globalRankings').as('globalRankings')
    cy.route('GET', 'https://api.jsonbin.io/b/5c875c79adeb832d3ec6732d/latest', 'fixture:ranking').as('globalRankings')
    cy.route('POST', 'http://localhost:5001/api/v0/id?stream-channels=true', 'fixture:ipfs')
    cy.route('GET', '/manifest.json', 'fixture:manifest')
    cy.route('GET', '/', 'fixture:globalRankings')
    cy.route('GET', 'http://localhost:8000/home/@player1', 'fixture:ranking')


    // We use cy.visit({onBeforeLoad: ...}) to delete native fetch and load polyfill code instead
    cy.visit('/', {
      onBeforeLoad (win) {
        delete win.fetch
        // since the application code does not ship with a polyfill
        // load a polyfilled "fetch" from the test
        win.eval(polyfill)
        win.fetch = win.unfetch
      },
    })
    cy.wait(500)
    cy.get('tbody>tr>td').contains("View").as('firstViewBtn')
    cy.get('@firstViewBtn').click()
  })

// it.only('requests playerRankings', function () {
//     // all calls will be done via XHR after we load polyfill
//     // so we can spy on them using cy.route
//     cy.server()
//     cy.route('GET', '/home/@player1', 'fixture:ranking1')
//     //cy.visit('/home/@player1')
//
//     // We use cy.visit({onBeforeLoad: ...}) to delete native fetch and load polyfill code instead
//     cy.request('/home/@player1', {
//       onBeforeLoad (win) {
//         delete win.fetch
//         // since the application code does not ship with a polyfill
//         // load a polyfilled "fetch" from the test
//         win.eval(polyfill)
//         win.fetch = win.unfetch
//       },
//     })
//   })

it('table loaded', function () {
  //cy.route('GET', '/home/@player1', 'fixture:ranking1')

    cy.get('tbody').find('tr').should('have.length', 6)
    }
  )

  // it('requests globalRankings', function () {
  //   // can spy now on XHR calls, while the application "thinks" it is using fetch
  //   // expect the server to return 5 items
  //   cy.wait('@globalRankings').its('response.body').should('have.length', 5)
  //   cy.route('GET', '/home/@player1', 'fixture:ranking1')
  //   cy.visit('/home/@player1')
  // })
})
