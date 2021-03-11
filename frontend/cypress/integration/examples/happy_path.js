/// <reference types="cypress" />
context('Phase 1', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Register works', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('input[name="name"]')
      .type('Tester').should('have.value', 'Tester')
    cy.get('input[name="email"]')
      .type('test@unsw.edu.au').should('have.value', 'test@unsw.edu.au')
    cy.get('input[name="password"]')
      .type('adummypassword').should('have.value', 'adummypassword')
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click()
      .should(() => {
        expect(localStorage.getItem('token')).to.not.be.null
      })
    cy.location('pathname').should('eq', '/dashboard')
  })

  it('Can create a game', () => {
    cy.get('button[area-label="create game"]', { timeout: 10000 }).should('be.visible')
      .click()
    // Enter the game title
    cy.get('input[id="newGameName"]')
      .type('Test Quiz')
    // Submit the new game
    cy.get('button[area-label="submit button"]').should('be.visible')
      .click()
    // Create game session
    cy.get('button[area-label="create session button"]', { timeout: 10000 }).first()
      .should('be.visible')
      .click()
    // Close modal
    cy.visit('http://localhost:3000/dashboard')
    // Start game
    cy.get('button[area-label="start game button"]', { timeout: 10000 }).first()
      .should('be.visible')
      .click()
    // Check the url is correct
    cy.url().should('include', '/HostReadyUp/')
  })

  it('Can end a game', () => {
    // End game
    cy.get('button[area-label="end game button"]').should('be.visible')
      .click()
  })

  it('Is shown results after ending game', () => {
    // Check results url is correct
    cy.url().should('include', '/results/')
    // Check results page
    cy.get('h1').should('have.text', 'No Results')
  })
    
  it('Can log out', () => {
    // Logout
    cy.get('header')
      .within(() => {
        cy.get('button[area-label="logout"]').should('be.visible')
          .click()
          .should(() => {
            expect(localStorage.getItem('token')).to.be.null
          })
      })
  })
})

context('Phase 2', () => {
  it('Can log back in', () => {
    // Log in
    cy.visit('http://localhost:3000/login')
    cy.get('input[name="email"]')
      .type('test@unsw.edu.au').should('have.value', 'test@unsw.edu.au')
    cy.get('input[name="password"]')
      .type('adummypassword').should('have.value', 'adummypassword')
    cy.get('button[type="submit"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('token')).to.not.be.null
      })
    cy.location('pathname').should('eq', '/dashboard')
  })
})