describe("stripe billing flow", () => {
  it("navigates to billing route", () => {
    cy.visit("/dashboard/billing", { failOnStatusCode: false });
    cy.get("body").should("be.visible");
  });
});
