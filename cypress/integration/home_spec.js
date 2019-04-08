describe('Home Component', () => {

  let polyfill

  // grab fetch polyfill from remote URL, could be also from a local package
  before(() => {
    cy.server()
    cy.route('GET', 'https://unpkg.com/unfetch/dist/unfetch.umd.js', 'fixture:polyfill')
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
    cy.route('GET', 'https://api.jsonbin.io/b/5c875c79adeb832d3ec6732d/latest', 'fixture:ranking1').as('globalRankings')
    cy.route('POST', 'http://localhost:5001/api/v0/id?stream-channels=true', 'fixture:ipfs')
    cy.route('GET', '/manifest.json', 'fixture:manifest')
    cy.route('GET', '/', 'fixture:globalRankings')
    cy.route('GET', 'http://localhost:8000/home/@player1', 'fixture:ranking1')
})
    it('View btn click Home route', () => {
        //cy.RankingSeedViaGlobalViewBtn()
        //cy.GlobalRankingWitCyStub()
        // cy.server()
        // //cy.route('GET', '/', 'fixture:globalRankings.json').as('globalRankings')
        // cy.route('GET', 'https://api.jsonbin.io/b/5c36f5422c87fa27306acb52/latest', 'fixture:globalRankings.json').as('globalRankings')
        // cy.route('POST', 'http://localhost:5001/api/v0/id?stream-channels=true', 'fixture:ipfs.json')
        // //cy.route('GET', '/', 'fixture:manifest')
        // cy.route('GET', '/', 'fixture:globalRankings')
        // cy.route('GET', '/home/@:username', 'fixture:ranking1')
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
        //cy.visit('/home/@player1')

        cy.get('tbody>tr>td').contains("View").as('firstViewBtn')
          cy.get('@firstViewBtn').click()
          cy.get('tbody').find('tr').should('have.length', 6)
      })

      it('table loaded', function () {
        //cy.route('GET', '/home/@player1', 'fixture:ranking1')

          cy.get('tbody').find('tr').should('have.length', 6)
          }
        )
  })
