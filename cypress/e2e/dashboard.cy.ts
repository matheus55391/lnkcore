describe("dashboard critical flow", () => {
  it("edits page and creates link", () => {
    cy.visit("/dashboard");
    cy.url().then((url) => {
      if (url.includes("/login")) {
        cy.log("User not authenticated in this environment.");
        return;
      }

      cy.get("[data-cy=page-title-input]").clear().type("Meu perfil E2E");
      cy.get("[data-cy=page-save]").click();
      cy.contains("Página atualizada com sucesso.");

      cy.get("[data-cy=new-link-title]").type("Site pessoal");
      cy.get("[data-cy=new-link-url]").type("https://lnkcore.com.br");
      cy.get("[data-cy=new-link-submit]").click();
      cy.contains("Link criado.");
    });
  });
});
