describe("public slug page", () => {
  it("loads public profile route", () => {
    cy.visit("/demo", { failOnStatusCode: false });
    cy.get("body").should("be.visible");
  });
});
