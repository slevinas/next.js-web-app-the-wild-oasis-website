describe("Auth Session Tests", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/account");
  });

  it("should log in and verify session with guest ID and role", () => {
    // Simulate clicking the "Continue with Google" button
    // cy.get("button").contains("Continue with Google").click();

    // Intercept the auth callback and mock the session
    // cy.intercept("/api/auth/session").as("getSession");
    cy.intercept("**/*", (req) => {
      console.log("Outgoing request:", req.url);
    });
    // cy.intercept("/api/auth/session", (req) => {
    //   console.log("Intercepted session request:", req);
    //   req.reply({
    //     statusCode: 200,
    //     body: {
    //       user: {
    //         name: "Sagi Levinas",
    //         email: "slevinas@gmail.com",
    //         image: "https://example.com/image.png",
    //         guestId: 123,
    //         role: "guest",
    //       },
    //       expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //     },
    //   });
    // }).as("getSession");
    // cy.wait("@getSession").then(({request, response}) => {
     
    //   console.log("Intercepted session request:", request);
    //   console.log("Intercepted session response:", response);
    // }
    // );

    // // Intercept the Google auth flow
    // cy.origin("https://accounts.google.com", () => {
    //   cy.get("button").contains("Choose an account").click();
    // });

    // Wait for the session request to complete
    // cy.wait("@getSession");
    cy.pause();

    // Check if redirected to the account page
    cy.url().should("include", "/account");
    cy.contains("Welcome").should("exist");

    // Verify the session data
    cy.request("/api/auth/session").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user.guestId).to.eq(123);
      expect(response.body.user.role).to.eq("guest");
    });
  });
});
