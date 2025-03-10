// cypress/e2e/login.cy.js

describe('Login Page', () => {
  it('should navigate to the login page and display the login button', () => {
    cy.visit('http://localhost:3000/login'); 

    // Check if the login page is loaded
    cy.contains('Continue with Google').should('be.visible');

    // Simulate a login click (assuming your login button has a data-cy attribute)
    cy.get('[data-cy="sign-in-button"]').click();

    // Verify redirection to Google authentication
    cy.url().should('include', 'accounts.google.com');
  });
});
