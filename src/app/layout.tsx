import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackWrapper from "@/components/FeedbackWrapper";

export const metadata: Metadata = {
  title: "TCM Wellness — Food as Medicine, Made Personal",
  description: "Discover your body type with TCM. AI-powered personalized wellness recommendations based on ancient Chinese wisdom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FeedbackWrapper />
          </LanguageProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
