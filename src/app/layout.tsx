import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.makebio.com.br"),

  title: {
    default: "MakeBio - Crie sua página de links",
    template: "%s | MakeBio",
  },

  description:
    "Crie seu link na bio em português para Instagram, TikTok, YouTube e WhatsApp. Temas, editor simples e plano gratuito para começar.",

  keywords: [
    "link na bio",
    "linktree",
    "bio links",
    "página de links",
    "instagram bio",
    "link da bio",
    "makebio",
    "criador de bio",
    "link para instagram",
    "mini site",
    "social links",
    "links personalizados",
  ],

  authors: [
    {
      name: "MakeBio",
      url: "https://www.makebio.com.br",
    },
  ],

  creator: "MakeBio",
  publisher: "MakeBio",

  category: "technology",

  alternates: {
    canonical: "https://www.makebio.com.br",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.makebio.com.br",
    siteName: "MakeBio",
    title: "MakeBio - Crie sua página de links",
    description:
      "Monte seu link na bio em português para Instagram, TikTok, YouTube e WhatsApp. Temas, editor simples e plano gratuito.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MakeBio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MakeBio - Crie sua página de links",
    description:
      "Sua bio profissional para Instagram, TikTok, YouTube e muito mais.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
      },
    ],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}