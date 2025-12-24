import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Flash Lane Logistics | Global Freight & Courier Services",
    template: "%s | Flash Lane Logistics",
  },
  description: "Fast, reliable, and secure global logistics solutions. Track your shipments in real-time with Flash Lane Logistics. Air, Ocean, and Road freight experts.",
  keywords: ["logistics", "courier", "shipping", "freight", "tracking", "delivery", "cargo", "flash lane"],
  authors: [{ name: "Flash Lane Logistics" }],
  creator: "Flash Lane Logistics",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Flash Lane Logistics | Global Freight & Courier Services",
    description: "Fast, reliable, and secure global logistics solutions. Track your shipments in real-time.",
    siteName: "Flash Lane Logistics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flash Lane Logistics",
    description: "Fast, reliable, and secure global logistics solutions.",
    creator: "@flashlane",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
