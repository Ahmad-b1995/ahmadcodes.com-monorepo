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
  title: "Ahmad Bagheri - Senior Full Stack Developer",
  description: "7 years of experience as a senior full-stack developer specializing in building scalable ERP web solutions. Expert in Next.js, TypeScript, Django, and GraphQL across cryptocurrency, e-commerce, and enterprise applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body
        className="scroll-smooth leading-relaxed text-slate-600 selection:bg-primary-100 selection:text-primary-900
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
