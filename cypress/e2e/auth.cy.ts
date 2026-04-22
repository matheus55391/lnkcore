describe("auth flows", () => {
  const suffix = Date.now();
  const email = `e2e-${suffix}@lnkcore.test`;
  const password = "SenhaForte123!";

  it("registers a new user", () => {
    cy.visit("/register");
    cy.get("[data-cy=register-name]").type("E2E User");
    cy.get("[data-cy=register-email]").type(email);
    cy.get("[data-cy=register-password]").type(password);
    cy.get("[data-cy=register-submit]").click();
    cy.url().should("include", "/dashboard");
  });

  it("logs in existing user", () => {
    cy.visit("/login");
    cy.get("[data-cy=login-email]").type(email);
    cy.get("[data-cy=login-password]").type(password);
    cy.get("[data-cy=login-submit]").click();
    cy.url().should("include", "/dashboard");
  });
});
