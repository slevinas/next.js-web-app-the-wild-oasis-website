describe('Login and Reservation Flow', () => {
  beforeEach(() => {
    // Start from the login page
    cy.visit('/login');
  });

  it('Should allow user to log in with Google', () => {
    // Click the "Continue with Google" button
    cy.contains('Continue with Google').click();

    // Assuming this redirects to a Google auth page (Mocking or handling this step is necessary)
    // Check if redirected to the account page
    cy.pause()
    cy.url().should('include', '/account');
    cy.contains('Welcome').should('exist');
  });

  it('Should allow the user to make a reservation', () => {
    // Navigate to cabins page
    cy.visit('/cabins');
    
    // Select a cabin
    cy.get('.cabin-card').first().click();
    
    // Select date range for reservation
    cy.get('[data-cy=start-date]').type('2025-04-01');
    cy.get('[data-cy=end-date]').type('2025-04-05');
    
    // Select number of guests
    cy.get('[name=numGuests]').select('2');

    // Submit the reservation form
    cy.contains('Reserve now').click();

    // Check if redirected to the reservations page
    cy.url().should('include', '/account/reservations');
    cy.contains('Reservation confirmed').should('exist');
  });
});
