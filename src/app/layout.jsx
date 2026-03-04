import "@/app/globals.css";
import { Space_Grotesk, Hind } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { EducationalOrganizationJsonLd } from "@/components/json-ld/educational-organization";
import { Navbar } from "@/components/navigation/navbar";
import { siteConfig } from "@/lib/site-config";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const fontBody = Hind({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "PYQPRO | SPPU PYQs, Syllabus, Notes",
    template: "%s | PYQPRO"
  },
  description: siteConfig.description,
  keywords: [
    "SPPU previous year question papers",
    "engineering PYQ",
    "Pune University notes",
    "SPPU syllabus",
    "PYQPRO"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "PYQPRO",
    description: siteConfig.description,
    siteName: "PYQPRO",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "PYQPRO",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body className={`${fontDisplay.variable} ${fontBody.variable} min-h-screen bg-slate-50 text-base text-slate-600`}>
        <EducationalOrganizationJsonLd />
        <GoogleAnalytics />
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500 sm:px-6 lg:px-8">
            PYQPRO - Built for Indian engineering students.
          </div>
        </footer>
      </body>
    </html>
  );
}
