"use client";

import { useState } from "react";

type PageData = {
  slug: string;
  title: string;
  description: string | null;
  avatarUrl: string | null;
};

type LinkData = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  position: number;
};

type Props = {
  initialPage: PageData | null;
  initialLinks: LinkData[];
};

export function DashboardClient({ initialPage, initialLinks }: Props) {
  const [page, setPage] = useState(initialPage);
  const [links, setLinks] = useState(initialLinks);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function savePage(formData: FormData) {
    const payload = {
      slug: String(formData.get("slug") || ""),
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      avatarUrl: String(formData.get("avatarUrl") || ""),
    };

    const response = await fetch("/api/dashboard/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? "Falha ao atualizar página");
      return;
    }

    setPage(body.page);
    setMessage("Página atualizada com sucesso.");
  }

  async function createLink() {
    const response = await fetch("/api/dashboard/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newLinkTitle,
        url: newLinkUrl,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? "Falha ao criar link");
      return;
    }

    setLinks((prev) => [...prev, body.link]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setMessage("Link criado.");
  }

  async function deleteLink(linkId: string) {
    const response = await fetch(`/api/dashboard/links/${linkId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Falha ao remover link.");
      return;
    }

    setLinks((prev) => prev.filter((item) => item.id !== linkId));
    setMessage("Link removido.");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 p-5">
        <h2 className="text-lg font-semibold">Editar página</h2>
        <form action={savePage} className="mt-4 grid gap-3" data-cy="page-form">
          <input
            name="slug"
            data-cy="page-slug-input"
            defaultValue={page?.slug ?? ""}
            placeholder="slug"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <input
            name="title"
            data-cy="page-title-input"
            defaultValue={page?.title ?? ""}
            placeholder="Título"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <textarea
            name="description"
            defaultValue={page?.description ?? ""}
            placeholder="Bio"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <input
            name="avatarUrl"
            defaultValue={page?.avatarUrl ?? ""}
            placeholder="URL do avatar"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <button
            className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
            type="submit"
            data-cy="page-save"
          >
            Salvar página
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 p-5">
        <h2 className="text-lg font-semibold">Links</h2>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            data-cy="new-link-title"
            value={newLinkTitle}
            onChange={(event) => setNewLinkTitle(event.target.value)}
            placeholder="Título do link"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
          <input
            data-cy="new-link-url"
            value={newLinkUrl}
            onChange={(event) => setNewLinkUrl(event.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={createLink}
            data-cy="new-link-submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
          >
            Adicionar
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {links.map((link) => (
            <article
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-3"
            >
              <div>
                <p className="font-medium">{link.title}</p>
                <p className="text-sm text-zinc-600">{link.url}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteLink(link.id)}
                className="rounded-lg border border-zinc-300 px-3 py-1 text-sm"
              >
                Remover
              </button>
            </article>
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-zinc-700">{message}</p> : null}
    </div>
  );
}
