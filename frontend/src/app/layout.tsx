import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MargApply — Autonomous AI Agent for Automated Job Applications",
  description: "Accelerate your career search with MargApply (RecruitAI). An intelligent agentic SaaS that deconstructs JDs, maps candidate personas, and autonomously submits high-scoring job applications.",
  keywords: [
    "AI Job Search",
    "Autonomous Job Application",
    "Agentic SaaS",
    "LangGraph Job Hunting",
    "RecruitAI",
    "MargApply",
    "Automated Resume Matching",
    "Bengaluru Tech Jobs AI"
  ],
  authors: [{ name: "MargApply Systems" }],
  openGraph: {
    title: "MargApply — Autonomous AI Agent for Automated Job Applications",
    description: "Accelerate your career search with MargApply (RecruitAI). An intelligent agentic SaaS that deconstructs JDs, maps candidate personas, and autonomously submits high-scoring job applications.",
    url: "https://margapply-saas-f5vl.vercel.app",
    siteName: "MargApply",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MargApply — Autonomous AI Agent for Automated Job Applications",
    description: "Accelerate your career search with MargApply (RecruitAI). An intelligent agentic SaaS that deconstructs JDs, maps candidate personas, and autonomously submits high-scoring job applications.",
  },
  alternates: {
    canonical: "https://margapply-saas-f5vl.vercel.app",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MargApply",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "description": "An autonomous agentic SaaS platform that deconstructs JDs, maps candidate personas, and automatically submits tailored job applications.",
  "publisher": {
    "@type": "Organization",
    "name": "MargApply Systems",
    "url": "https://margapply-saas-f5vl.vercel.app"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
