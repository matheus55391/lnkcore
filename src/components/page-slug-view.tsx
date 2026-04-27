import { Page } from "@/@types"

type SlugPageViewProps = {
    page: Page
}
export function SlugPageView({ page }: SlugPageViewProps) {
    return (
        <main className="min-h-dvh flex flex-col items-center px-6 py-16 bg-muted/30">
            <div className="w-full max-w-md space-y-6 text-center">
                {page.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={page.image}
                        alt={page.title}
                        className="h-24 w-24 rounded-full mx-auto object-cover"
                    />
                ) : null}
                <div>
                    <h1 className="text-2xl font-bold">{page.title}</h1>
                    {page.bio ? (
                        <p className="text-muted-foreground text-sm mt-2">{page.bio}</p>
                    ) : null}
                </div>
                <div className="flex flex-col gap-3">
                    {page.links?.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border bg-background py-3 px-4 text-sm font-medium hover:bg-accent transition"
                        >
                            {link.title}
                        </a>
                    ))}
                </div>
            </div>
        </main>
    )
}