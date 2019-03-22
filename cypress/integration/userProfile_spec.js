describe("User Profile Test", function(){

  beforeEach(() => {
  cy.visit('/')
  cy.contains('Update Profile').click()
  })

  it.only('Makes an assertion ', function(){
    //NB: comment/uncomment below and beforeEach according to single or multi tests
    // cy.visit('/')
    // cy.contains('Update Profile').click()
    cy.url()
    .should('include', '/update/@player1')
    cy.focused()
    .should('have.class', 'contactno')
    })

    it('accepts input', () => {
      const contactnoTest = '123456789012345'
      cy.get('.contactno').clear()
      .type('123456789012345')
      .should('have.value', contactnoTest)
  })

  context('Form Submission To BC', () => {
    beforeEach(() => {
    cy.server()
    })
    it('Adds a user update on submit', () => {
      cy.get('.email').clear()
      .type('cypress@test.com')
      .should('have.value', 'cypress@test.com')
      //cy.get('.updateForm')
      //cy.contains('Update Profile').click()
    })
    it('Adds a player description on submit', () => {
      cy.get('.description').clear()
      .type('test description')
      .should('have.value', 'test description')
      // cy.get('.updateForm')
      // cy.contains('Update Profile').click()
    })
    it('Returns to home on submit', () => {
      cy.route('POST','https://localhost:8000/json', [{ "RANKINGNAME":"testRank1","RANKINGDESC":"testRank","ACTIVE":true,"RANKINGID":"5c6a7cf5a83a2931773847b8"},{"RANKINGID":"5c6a81756874aa33ba152e56","ACTIVE":true,"RANKINGDESC":"test","RANKINGNAME":"test11"},{"RANKINGNAME":"testranking2","RANKINGDESC":"test2","ACTIVE":true,"RANKINGID":"5c81c1e944e81057efe3e2c8"},{"RANKINGID":"5c87394bbb08b22a75685941","ACTIVE":true,"RANKINGDESC":"tl3","RANKINGNAME":"testLadder3"},{"RANKINGNAME":"mplayer1rank","RANKINGDESC":"mp1r","ACTIVE":true,"RANKINGID":"5c875c79adeb832d3ec6732d" }])// cy.get('.description').clear()
      // .type('test description')
      // .should('have.value', 'test description')
      //do something as otherwise it's supposed to do nothing currently
      cy.get('.description').clear()
      .type('test description')
      .should('have.value', 'test description')
    //   cy.get('.updateProfileBtn').click()
    // //  cy.contains('Update Profile').click()
    //   cy.url()
    //   .should('eq', 'http://localhost:8000/')
    })

    it('Shows an error message on failed submission', () => {
      cy.route({
        url:'https://localhost:8000/json',
        method: 'POST',
        status: 500,
        response: {}
      })
      //do something as otherwise it's supposed to do nothing currently
      // cy.get('.description').clear()
      // .type('test description')
      // .should('not.have.value', 'test descriptio')
      cy.get('.updateProfileBtn').click()
      cy.get('.error')
      .should('be.visible')
    })
  })
})
