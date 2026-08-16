import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ahmadcodes.com",
  ),
  title: {
    default: "Ahmad Bagheri | Senior Full-Stack Engineer",
    template: "%s · Ahmad Bagheri",
  },
  description:
    "Senior full-stack engineer. TypeScript across React, Next.js, and NestJS. 7+ years shipping production apps. Also ERP/NetSuite integrations. Open to full-time and contract, Armenia or remote.",
  keywords: [
    "Full-stack engineer",
    "TypeScript",
    "React",
    "Next.js",
    "NestJS",
    "PostgreSQL",
    "NetSuite",
    "Contract developer",
  ],
  authors: [{ name: "Ahmad Bagheri", url: "https://ahmadcodes.com" }],
  openGraph: {
    type: "website",
    title: "Ahmad Bagheri | Senior Full-Stack Engineer",
    description:
      "Senior full-stack engineer. TypeScript across React, Next.js, and NestJS. Open to full-time and contract.",
    url: "https://ahmadcodes.com",
    siteName: "ahmadcodes.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Bagheri | Senior Full-Stack Engineer",
    description:
      "Senior full-stack engineer. TypeScript across React, Next.js, and NestJS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`} suppressHydrationWarning>
      <body
        className="leading-relaxed text-slate-600 selection:bg-primary-100 selection:text-primary-900
         mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0 antialiased"
      >
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
