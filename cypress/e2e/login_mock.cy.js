describe("Google Authentication Flow", () => {
  it("should authenticate via Google and redirect to /account", () => {
    // Step 1: Visit the login page
    cy.visit("/login");

    // Step 2: Click the "Continue with Google" button
    cy.contains("Continue with Google").click();

    // Step 3: Simulate the Google OAuth flow
    // You need to intercept the request to Google's OAuth URL
    cy.origin("https://accounts.google.com", () => {
      // Simulate clicking a Google account
      cy.get('input[type="email"]').type("testuser@gmail.com{enter}");
      cy.get('input[type="password"]').type("password{enter}");
    });

    // Step 4: Wait for the redirection to /account
    cy.url().should("include", "/account");
    cy.contains("Welcome").should("exist");

    // Step 5: Verify the session data by calling the NextAuth session API
    cy.request("/api/auth/session").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("user");
      expect(response.body.user).to.have.property("id").and.be.a("number");
      expect(response.body.user).to.have.property("role", "guest");
      expect(response.body.user).to.have.property("name", "Sagi Levinas");
      expect(response.body.user).to.have.property("email", "slevinas@gmail.com");
    });
  });
});
