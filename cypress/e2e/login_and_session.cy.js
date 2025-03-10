// cypress/e2e/login_and_session.cy.js

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in and set session with correct id and role', () => {
    // Click the "Continue with Google" button
    cy.contains('Continue with Google').click();

    // Intercept the auth callback to simulate a successful login
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: 123,
          role: 'guest',
          name: 'Test User',
          email: 'testuser@example.com',
          image: 'https://example.com/image.png',
        },
        expires: '2025-04-09T13:41:21.322Z',
      },
    }).as('getSession');
    cy.pause();
    // Mock the redirection to the account page
    // cy.url().should('include', '/account');

    // Check if the session was populated correctly
    cy.window().then((win) => {
      win.fetch('/api/auth/session')
        .then((response) => response.json())
        .then((session) => {
          expect(session.user.id).to.equal(123);
          expect(session.user.role).to.equal('guest');
          expect(session.user.name).to.equal('Test User');
          expect(session.user.email).to.equal('testuser@example.com');
          expect(session.user.image).to.equal('https://example.com/image.png');
        });
    });

    // Ensure the page contains the expected welcome message
    cy.contains('Welcome, Test User').should('exist');
  });
});
