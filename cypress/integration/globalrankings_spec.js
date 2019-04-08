describe('GlobalRankings Display', () => {
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
    cy.InitializeServerAndRoutes()
  })

  it('Loads ranking json on page load', () => {
      //cy.GlobalSeed()
      //let polyfill = cy.InitializeServerAndRoutes()
      cy.visit('/', {
        onBeforeLoad (win) {
          delete win.fetch
          // since the application code does not ship with a polyfill
          // load a polyfilled "fetch" from the test
          win.eval(polyfill)
          win.fetch = win.unfetch
        }})
      cy.get('.bstable')
      .should('be.visible')

      cy.get('.bstable').find('tr').should('have.length', 6)

      cy.get('.error')
      .should('not.be.visible')
    })
})
